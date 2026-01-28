const express = require("express") ;
const app = express() ;
require("dotenv").config() ;

const {connect} = require("./src/config/db") ;
const cors = require("cors") ;
const userRouter = require("./src/routes/userRouter") ;
const superSheldonFormRouter = require("./src/routes/superSheldonFormRouter") ;

// Mongoose model for storing form submissions
const SendEmailModel = require("./src/model/sendEmail");
// Email service
const sendEmail = require("./src/utils/emailService");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper function to escape HTML
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Constants for URLs (you can move these to .env if needed)
const DOWNLOAD_GUIDE_URL = process.env.DOWNLOAD_GUIDE_URL || "https://supersheldon.com/guide";
const DEMO_URL = process.env.DEMO_URL || "https://supersheldon.com/demo";
const allowlist = new Set([
  "http://localhost:3000",
  "http://localhost:3003",
  "https://www.supersheldon.com",
  "https://supersheldon.com"
]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowlist.has(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json()) ;

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Book Demo 
app.use("/user" , userRouter) ;

// --------- Guide Download Endpoint ----------
app.post("/api/download-guide", async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "Email is required." });
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ ok: false, message: "Please provide a valid email." });
    }

    // Send guide email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Hi there,</h2>
        
        <p>Thank you for showing interest in a 1:1 guidance session with Super Sheldon.</p>
        
        <p>Our team has received your request and will connect with you shortly to coordinate and book the demo at your convenient time.</p>
        
        <p>Thank you for your time and interest.<br/>
        We look forward to speaking with you soon.</p>
        
        <p style="margin-top: 30px;">
          Warm regards,<br/>
          <strong>Team Super Sheldon</strong>
        </p>
      </div>
    `;

    const emailResult = await sendEmail(
      normalizedEmail,
      "Thanks for Booking a 1:1 Session with Super Sheldon",
      html
    );

    if (!emailResult?.ok) {
      return res.status(500).json({
        ok: false,
        message: "Failed to send email. Please try again later.",
      });
    }

    return res.json({
      ok: true,
      message: "Guide sent successfully! Check your inbox.",
    });
  } catch (err) {
    console.error("download-guide error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error. Please try again later.",
    });
  }
});

// --------- SuperSheldon form submission ----------
app.post("/api/super-sheldon-form/submit", async (req, res) => {
  try {
    const { fullName, email, mobile, childAgeYear, subject } = req.body || {};

    if (![fullName, email, mobile, childAgeYear, subject].every(Boolean)) {
      return res
        .status(400)
        .json({ ok: false, message: "All fields are required." });
    }

    const normalized = {
      fullName: String(fullName || "").trim(),
      email: String(email || "").trim().toLowerCase(),
      mobile: String(mobile || "").trim(),
      childAgeYear: String(childAgeYear || "").trim(),
      subject: String(subject || "").trim(),
    };

    if (!emailRegex.test(normalized.email)) {
      return res
        .status(400)
        .json({ ok: false, message: "Please provide a valid email." });
    }

    // Save submission
    await SendEmailModel.create(normalized);

    // Send confirmation email with the guide link
    const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        
            <p style="font-size: 16px; line-height: 1.6;">
              Hi there,
            </p>
        
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for signing up! 😊<br/>
              We're excited to share your <strong>Free Curriculum Guidance Book</strong> to help you support your child's learning journey with clarity and confidence.
            </p>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
              <strong>📘 What you'll find inside the guide</strong>
            </p>
        
            <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>Age-appropriate learning strategies</li>
              <li>How to identify if your child needs extra academic support</li>
              <li>Practical tips to support homework without stress</li>
              <li>Clear curriculum breakdown by year group</li>
              <li>Proven exam preparation techniques</li>
            </ul>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
              👉 <a href="${DOWNLOAD_GUIDE_URL}" target="_blank" rel="noopener noreferrer"
                style="color: #f97316; font-weight: bold; text-decoration: none;">
                Download guide here
              </a>
              <br/>
              <a href="${DOWNLOAD_GUIDE_URL}" target="_blank" rel="noopener noreferrer"
                style="color: #2563eb; font-size: 14px; word-break: break-all;">
                ${DOWNLOAD_GUIDE_URL}
              </a>
            </p>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
              <strong>🎓 Want personalised guidance for your child?</strong><br/>
              Our academic experts would love to understand your child's needs and suggest the right learning path.
            </p>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 10px;">
              📅 <a href="${DEMO_URL}" target="_blank" rel="noopener noreferrer"
                style="color: #f97316; font-weight: bold; text-decoration: none;">
                Book a free 1-on-1 demo session here
              </a>
              <br/>
              <a href="${DEMO_URL}" target="_blank" rel="noopener noreferrer"
                style="color: #2563eb; font-size: 14px;">
                ${DEMO_URL}
              </a>
            </p>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 15px;">
              In this session, we will:
            </p>
        
            <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>Assess your child's current learning level</li>
              <li>Share a personalised academic roadmap</li>
              <li>Explain how Super Sheldon supports students step by step</li>
            </ul>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
              If you have any questions, just reply to this email. We're happy to help.
            </p>
        
            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
              Warm regards,<br/>
              <strong>Team Super Sheldon</strong><br/>
              Building confident learners, one child at a time 🚀
            </p>
        
          </div>
`;

    const emailResult = await sendEmail(
      normalized.email,
      "Your Free Curriculum Guidance Book",
      html
    );

    if (!emailResult?.ok) {
      return res.status(500).json({
        ok: false,
        message: "Form saved but failed to send email. Please try again.",
      });
    }

    return res.json({
      ok: true,
      message: "Form submitted successfully.",
    });
  } catch (err) {
    console.error("super-sheldon-form submit error:", err);
    return res.status(500).json({
      ok: false,
      message: "Unexpected error. Please try again later.",
    });
  }
});
// Super Sheldon Form
app.use("/api/super-sheldon-form", superSheldonFormRouter) ;

// parallely calling two function to connent DB and redis both at the same time
const initializeConnection = async ()=>{

    try{
        await connect() ;
        console.log("DB Connected") ;
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });
    }
    catch(err)
    {
        console.log("Error : " + err) ;
    }
}

initializeConnection() ;
