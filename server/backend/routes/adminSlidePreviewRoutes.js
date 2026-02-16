import { Router } from "express";
import {
  deleteAdminAnnoucement,
  getAnnouncementsPreview,
  getPreview,
  getPreviewAnnoucement,
} from "../controllers/admin/adminPreviewCtrl.js";

const AdminSlidePreviewRoutes = Router();

AdminSlidePreviewRoutes.post("/admin/preview", getPreview);

AdminSlidePreviewRoutes.get("/all-preview", getAnnouncementsPreview);

AdminSlidePreviewRoutes.get("/announcement-preview/:id", getPreviewAnnoucement);

AdminSlidePreviewRoutes.delete("/admin/announcement/:id", deleteAdminAnnoucement);

export default AdminSlidePreviewRoutes;
