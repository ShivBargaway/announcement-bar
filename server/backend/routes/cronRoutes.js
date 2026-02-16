import { Router } from "express";
import { runLiveCrojJob } from "../controllers/cronCtrl/liveCronCtrl.js";
import { createLiveDatabaseConnection } from "../middlewares/cronMiddleware.js";

const CronRoutes = Router();

if (process.env.ENV === "dev") {
  CronRoutes.get("/runLiveCronjob", createLiveDatabaseConnection, runLiveCrojJob);
}

export default CronRoutes;
