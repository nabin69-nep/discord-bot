const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timeStamp: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const URL = mongoose.models.urls || mongoose.model("urls", urlSchema);

module.exports = URL;
