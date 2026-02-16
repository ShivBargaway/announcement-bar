import { Router } from "express";
import {
  announcementData,
  announcementWebappData,
  updateAnimation,
  getAnimation
} from "../controllers/animationCtrl.js";

const AnimationRoutes = Router();

AnimationRoutes.get("/animation-backend", announcementWebappData);

AnimationRoutes.put("/animation/:id", updateAnimation);

AnimationRoutes.get("/animation-front", announcementData);

AnimationRoutes.get("/animation", getAnimation);

export default AnimationRoutes;