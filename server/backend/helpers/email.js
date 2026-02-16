import mailgun from "mailgun-js";

const sendEmailViaMailgun = (emailData) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  emailData.from = "<noreply@mail.webrexstudio.com>";

  const mg = mailgun({ apiKey, domain });

  mg.messages().send(emailData, function (error, body) {
    if (error) {
      console.error(error);
    }
  });
};

// Usage
// const emailData = {
//   from: "hello@webrexstudio.com",
//   to: "sanjay@webrexstudio.com",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomeness!",
//     html: "<html>HTML version of the message</html>",
// };

// sendEmailViaMailgun(emailData);
export { sendEmailViaMailgun };
