import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import archiver from "archiver";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { ApiResponse } from "../../helpers/common.js";
import { logger } from "../../services/logger/index.js";

const s3 = new S3Client({
  endpoint: process.env.VULTR_ENDPOINT,
  region: "us-east-1", // Replace with your endpoint
  credentials: {
    accessKeyId: process.env.VULTR_ACCESSKEY, // Replace with your access key
    secretAccessKey: process.env.VULTR_SECRET_ACCESSKEY, // Replace with your secret key
  },
});

// Backup directory
const backupDir = process.env.ENV === "dev" ? "./backup" : "/home/recruitment-apps/backup";

const postBackup = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const backup = await createBackup(body?.table || "");
    rcResponse.data = backup;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const createBackup = async (table = "") => {
  const now = new Date();
  const formattedTimestamp = now.toLocaleString().replace(/[/:, ]/g, "-");
  const backupDir = path.resolve("backup");

  const backupPath = path.join(backupDir, formattedTimestamp);
  const db_uri = process.env.MONGO_URL;
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  try {
    // Create a backup using mongodump command
    const backupCommand = table?.length
      ? `mongodump --uri=${db_uri} --out=${backupPath} --collection=${table}`
      : `mongodump --uri=${db_uri} --out=${backupPath}`;

    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        throw error;
      } else {
        // Compress the backup folder
        const zipFilePath = path.join(backupDir, `${formattedTimestamp}-backup.zip`);

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", {
          zlib: { level: 9 }, // Maximum compression
        });

        output.on("close", async () => {
          console.log(`Backup compressed and saved locally at: ${zipFilePath}`);
          await uploadToVultrS3(zipFilePath);
          fs.unlinkSync(zipFilePath); // Delete local zip after upload
          console.log(`Local backup zip file deleted: ${zipFilePath}`);
          fs.rmSync(backupDir, { recursive: true, force: true }); // Delete the backup directory
          removeBackupFiles();
        });
        archive.on("error", (err) => {
          throw err;
        });
        archive.pipe(output);
        archive.directory(backupPath, false);
        archive.finalize();
      }
    });
  } catch (err) {
    logger.error(err);
  }
};

const uploadToVultrS3 = async (localFilePath) => {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const bucketName = process.env.VULTR_BUCKETNAME; // Set your Vultr S3 Bucket name
    const objectKey = `backup/${path.basename(localFilePath)}`; // Uploading under "backup/" folder

    // Create an S3 upload command
    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: fileContent,
      ContentType: "application/zip", // Set MIME type as ZIP
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);
    console.log(`Backup uploaded to Vultr S3-compatible storage: ${data?.ETag}`);
    console.log(`https://${process.env.VULTR_BUCKETNAME}.ewr1.vultrobjects.com/${objectKey}`);
  } catch (err) {
    console.error("Error uploading to Vultr S3:", err);
  }
};

const removeBackupFiles = async () => {
  try {
    const folderName = `backup`;
    const bucketName = process.env.VULTR_BUCKETNAME;

    const now = new Date();

    // List objects in the backup folder
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${folderName}/`,
    });
    const { Contents } = await s3.send(listCommand);
    if (Contents && Contents.length > 0) {
      const objectsToDelete = Contents.filter(({ Key, LastModified }) => {
        const ageInDays = (now - new Date(LastModified)) / (1000 * 60 * 60 * 24);
        return ageInDays > 5;
      }).map(({ Key }) => ({ Key }));
      if (objectsToDelete.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: objectsToDelete },
        });
        await s3.send(deleteCommand);
      }
    }
  } catch (err) {
    logger.error(err);
  }
};

export { postBackup, createBackup };
