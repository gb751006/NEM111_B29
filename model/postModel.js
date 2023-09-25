const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    device: { type: String, required: true, enum: ["PC", "TABLET", "MOBILE"] },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = {
  PostModel,
};