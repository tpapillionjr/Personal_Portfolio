const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL || "tpapillionjr@gmail.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

const escapeHtml = (value = "") => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY environment variable." });
  }

  const { name = "", email = "", message = "", company = "" } = req.body || {};
  const cleanedName = String(name).trim();
  const cleanedEmail = String(email).trim();
  const cleanedMessage = String(message).trim();
  const cleanedCompany = String(company).trim();

  if (cleanedCompany) {
    return res.status(200).json({ ok: true });
  }

  if (!cleanedName || !cleanedEmail || !cleanedMessage) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(cleanedEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (cleanedMessage.length < 10) {
    return res.status(400).json({ error: "Message should be at least 10 characters long." });
  }

  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: cleanedEmail,
      subject: `Portfolio contact from ${cleanedName}`,
      text:
        `New portfolio message\n\n` +
        `Name: ${cleanedName}\n` +
        `Email: ${cleanedEmail}\n\n` +
        `${cleanedMessage}`,
      html:
        `<div style="font-family: Arial, sans-serif; line-height: 1.6;">` +
        `<h2>New portfolio message</h2>` +
        `<p><strong>Name:</strong> ${escapeHtml(cleanedName)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(cleanedEmail)}</p>` +
        `<p><strong>Message:</strong></p>` +
        `<p>${escapeHtml(cleanedMessage).replace(/\n/g, "<br>")}</p>` +
        `</div>`
    });

    if (error) {
      return res.status(500).json({ error: "Email provider rejected the message." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message." });
  }
};
