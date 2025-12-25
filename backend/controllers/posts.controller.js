import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import { error } from "console";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "API is working" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found" });

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
      likes: 0,
      active: true,
    });

    await post.save();

    return res.status(200).json({ message: "Post Created" });
  } catch (error) {
    res.status(505).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email profilePicture")
      .sort({ createdAt: -1 });

    console.log(`Fetched ${posts.length} posts from database`);
    return res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post Deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {

  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if(!user) return req.status(404).json({ message: "User not found" });

    const post = await Post.findOne({
      _id: post_id
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      comment: commentBody
    });

    await comment.save();

    return res.status(200).json({ message: "Comment added" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const get_comments_by_post = async (req, res) => {

  const { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.json({ comments: post.comments });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {

  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) return res.status(404).json({ message: "User not found" });

    const comment = await Comment.findOne({ "_id": comment_id });

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ "_id": comment_id });
    return res.json({ message: "Comment Deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {

  const { token,post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes + 1;
    await post.save();

    return res.json({ message: "Likes increments" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};