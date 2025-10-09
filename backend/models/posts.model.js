import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
