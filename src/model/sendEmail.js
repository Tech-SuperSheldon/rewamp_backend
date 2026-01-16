const mongoose = require("mongoose");

const SendEmailSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    childAgeYear: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "send_email" }
);

module.exports = mongoose.model("SendEmail", SendEmailSchema);
