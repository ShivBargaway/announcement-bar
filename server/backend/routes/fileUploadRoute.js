import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { postFileToShopify, removeFileFromShopify } from "../controllers/file/fileUploadCtrl.js";

const destinationDirectory = "./server/backend/uploads/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if directory exists
    if (!fs.existsSync(destinationDirectory)) {
      fs.mkdirSync(destinationDirectory, { recursive: true }); // recursive: true will create nested directories if they don't exist
    }

    cb(null, destinationDirectory);
  },
  filename: function (req, file, cb) {
    // Extract file extension
    const ext = path.extname(file.originalname);

    // Create a sanitized base filename
    const baseFilename = file.originalname
      .replace(ext, "") // Remove extension
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, ""); // Remove any character that is not alphanumeric or a hyphen

    // Combine sanitized filename with timestamp and original extension
    const newFilename = `${Date.now()}-${baseFilename}${ext}`;

    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

const FileUploadRoute = Router();

FileUploadRoute.post("/upload-to-shopify", upload.array("files"), postFileToShopify);
FileUploadRoute.delete("/remove-file", removeFileFromShopify);

export default FileUploadRoute;
