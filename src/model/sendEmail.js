const mongoose = require("mongoose");

const SendEmailSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    childAgeYear: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    submitFormData: {
      type: [
        {
          question: { type: String, trim: true, required: true },
          answer: { type: String, trim: true, required: true },
        },
      ],
      default: [],
    },
    bookingSummary: {
      meetingDate: { type: String, trim: true },
      startTimeUTC: { type: String, trim: true },
      endTimeUTC: { type: String, trim: true },
      timeZone: { type: String, trim: true },
      startTimeIST: { type: String, trim: true },
      endTimeIST: { type: String, trim: true },
      meetingUrl: { type: String, trim: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "send_email" }
);

module.exports = mongoose.model("SendEmail", SendEmailSchema);
