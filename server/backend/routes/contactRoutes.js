import { Router } from "express";
import { addClickData, addEmailContacts, getEmailContacts,addViewSlideData } from "../controllers/contact/contactCtrl.js";

const CotactRoutes = Router();
CotactRoutes.post("/submitContact", addEmailContacts);

CotactRoutes.post("/contact", getEmailContacts);

CotactRoutes.post("/addClick", addClickData);

CotactRoutes.post("/onShow", addViewSlideData);

export default CotactRoutes;
