import { Router } from "express";
import multer from "multer";
import { getFeedBack, getSinglePromoCode, postFeedBack } from "../controllers/feedBack/feedBack.js";
import { deleteSinglePromoCode, getPromoCodeForTable, postPromoCode } from "../controllers/feedBack/feedBack.js";

const FeedBackRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

FeedBackRoutes.post("/feed-back", upload.single("file"), postFeedBack);
FeedBackRoutes.get("/feed-back", getFeedBack);
FeedBackRoutes.post("/admin/getAllPromoCode", getPromoCodeForTable);
FeedBackRoutes.post("/admin/addPromoCode", postPromoCode);
FeedBackRoutes.delete("/admin/deleteSinglePromoCode/:_id", deleteSinglePromoCode);
FeedBackRoutes.post("/getSinglePromoCode", getSinglePromoCode);

export default FeedBackRoutes;
