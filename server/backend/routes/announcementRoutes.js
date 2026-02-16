import { Router } from "express";
import {
  addAnnoucement,
  copyAnnoucement,
  deleteAnnoucement,
  getAllCampaign,
  getAnnoucement,
  getAnnoucements,
  reOrderAnnoucement,
  updateAnnoucement,
} from "../controllers/announcementCtrl.js";

const AnnouncementRoutes = Router();

AnnouncementRoutes.delete("/announcement/:id", deleteAnnoucement);

AnnouncementRoutes.post("/announcement", addAnnoucement);

AnnouncementRoutes.put("/announcement/:id", updateAnnoucement);

AnnouncementRoutes.post("/annoucement/copy", copyAnnoucement);

AnnouncementRoutes.get("/annoucement/:id", getAnnoucement);

AnnouncementRoutes.post("/annoucement/reorder", reOrderAnnoucement);

AnnouncementRoutes.get("/annoucement", getAnnoucements);

AnnouncementRoutes.get("/getAllCampaign", getAllCampaign);
export default AnnouncementRoutes;
