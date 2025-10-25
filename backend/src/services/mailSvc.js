// mailSvc.js
async function sendMail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Missing email parameters");
  }

  const payload = {
    to,
    subject,
    text: text || "",
    html: html || ""
  };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("Mock mail sent", payload);
  }

  return { status: "queued", messageId: `msg_${Date.now()}` };
}

module.exports = {
  sendMail
};
