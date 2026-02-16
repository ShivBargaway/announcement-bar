import { Router } from "express";
import { getDismissProperty, updateDismissProperty } from "../controllers/dismissProperty/dismissProperty.js";

const dismissProperty = Router();

dismissProperty.put("/dismissProperty", updateDismissProperty);
dismissProperty.get("/dismissProperty", getDismissProperty);

export default dismissProperty;
