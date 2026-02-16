import { Router } from "express";
import { mailWithTemplate, sendTestMail } from "./../controllers/emails/emailCtrl.js";

const EmailRoutes = Router();

EmailRoutes.post("/send-test-mail", sendTestMail);

export default EmailRoutes;
