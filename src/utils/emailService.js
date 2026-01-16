const nodemailer = require("nodemailer");

// Create reusable transporter with multiple fallback options
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT || '587');
  
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000,
    logger: false, // Disable verbose logging
    debug: false,
  };

  // Port-specific configuration
  if (port === 587) {
    config.secure = false;
    config.requireTLS = true;
    config.tls = {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    };
  } else if (port === 465) {
    config.secure = true;
    config.tls = {
      rejectUnauthorized: false,
      minVersion: 'TLSv1',
    };
  } else if (port === 25) {
    config.secure = false;
    config.ignoreTLS = false;
    config.requireTLS = false;
  }

  return nodemailer.createTransport(config);
};

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @returns {Promise<{ok: boolean, message?: string, error?: string}>}
 */
const sendEmail = async (to, subject, html) => {
  try {
    // Validate inputs
    if (!to || !subject || !html) {
      return {
        ok: false,
        error: "Missing required parameters: to, subject, or html",
      };
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASS && !process.env.EMAIL_PASSWORD)) {
      console.warn("Email credentials not configured in .env file");
      return {
        ok: false,
        error: "Email service not configured",
      };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Super Sheldon" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    return {
      ok: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      ok: false,
      error: error.message || "Failed to send email",
    };
  }
};

module.exports = sendEmail;

