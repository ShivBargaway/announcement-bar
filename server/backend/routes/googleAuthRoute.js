import { Router } from "express";
import { getGoogleAuthCode, getGoogleAuthUrl } from "../controllers/google/googleAuthCtrl.js";

const GoogleAuthRoute = Router();

GoogleAuthRoute.get("/auth/url", getGoogleAuthUrl);
GoogleAuthRoute.get("/google/auth", getGoogleAuthCode);
export default GoogleAuthRoute;
