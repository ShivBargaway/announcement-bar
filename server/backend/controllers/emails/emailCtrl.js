import path from "path";
import pug from "pug";
import { ApiResponse } from "../../helpers/common.js";
import { sendEmailViaMailgun } from "../../helpers/email.js";

const mailWithTemplate = async ({ user, subject, template = "" }) => {
  try {
    const storeUrl = user?.shopUrl?.split(".myshopify.com")[0];
    user = {
      ...user,
      template,
      appName: process.env.SHOPIFY_APP_NAME,
      appUrl: process.env.SHOPIFY_APP_URL,
      shopifyAppUrl: process.env.SHOPIFY_STORE_APP_URL,
      appLogoUrl: `${process.env.SHOPIFY_APP_URL}/assets/webrex-seo-logo-white.png`,
      reviewLinkInOurApp: `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/review`,
    };

    // if(process.env.ENV == "dev") user["appLogoUrl"] = `${process.env.SHOPIFY_APP_URL}/assets/webrex-seo-logo-white.png`;
    if (process.env.ENV == "dev")
      user["appLogoUrl"] = `https://cdn.shopify.com/s/files/1/1509/6342/files/unnamed.png`;

    const templatePath = path.join("./", "server", "backend", "controllers", "emails", `common.pug`);

    const data = {
      from: process.env.SHOPIFY_APP_NAME + " <noreply@mail.webrexstudio.com>",
      replayTo: "<webrexseosupport@webrexstudio.com>",
      to: user?.email,
      subject,
      html: pug.renderFile(templatePath, user),
    };

    user.email && sendEmailViaMailgun(data);
  } catch (err) {
    throw err;
  }
};

const sendTestMail = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    await mailWithTemplate({ user: body.user, subject: body.subject, template: body.template });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

//Uncomment below line to send test mail
// await mailWithTemplate({
//   user: { email: "ravi@webrexstudio.com", storeName: "Ravi test12" },
//   subject: "",
//   template: "speedStatus",
// });

export { mailWithTemplate, sendTestMail };
