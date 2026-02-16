import { Router } from "express";
import { postDataForUninstallToInstallApp } from "../controllers/uninstallApp/uninstallAppCtrl.js";

const uninstallRoute = Router();

uninstallRoute.post("/uninstallToInstallApp", postDataForUninstallToInstallApp);

export default uninstallRoute;
