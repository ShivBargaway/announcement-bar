import { Router } from "express";
import { postBackup } from "../controllers/backup/backupCtrl.js";

const BackupRoutes = Router();

BackupRoutes.post("/dbbackup", postBackup);

export default BackupRoutes;
