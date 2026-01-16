const mongoose = require("mongoose");
const { DB_CONNECT_STRING } = process.env;

async function connect() {
  if (!DB_CONNECT_STRING) throw new Error("MONGODB_URI not set in .env");
  await mongoose.connect(DB_CONNECT_STRING, { dbName: "super_sheldon_form" });
  console.log("MongoDB connected");
}

module.exports = { connect, mongoose };
