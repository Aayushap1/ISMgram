require("dotenv").config();
const Post = require("../models/posts");
const User = require("../models/users");
const mongoose = require("mongoose");
const path = require("path");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// get all posts
const getPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(200).json(posts);
};

// get a single post
const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// create a new post
const createPost = async (req, res) => {
  try {
    const { user_id, firstName, lastName, email, content } = req.body;
    let image = null;
    if (req.file) {
      image = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer).content;
    }
    if (image) {
      console.log("1");
      let postImageUrl = await cloudinary.uploader.upload(image);
      postImageUrl = postImageUrl.url;
      console.log(postImageUrl);
      const post = await Post.create({ user_id, firstName, lastName, email, content, postImageUrl });
      // update user
      await User.updateOne({ _id: user_id }, { $push: { posts: post._id } });
      return res.status(200).json(post);
    } else {
      console.log("2");
      const post = await Post.create({ user_id, firstName, lastName, email, content });
      // update user
      await User.updateOne({ _id: user_id }, { $push: { posts: post._id } });
      return res.status(200).json(post);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such post" });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  // update user
  await User.updateOne({ _id: post.user_id }, { $pull: { posts: post._id } });

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such post" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(400).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

const addLike = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

const removeLike = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

const addComment = async (req, res) => {
  const { postId, user_id, firstName, lastName, email, imageUrl, comment } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(404).json({ error: "No such user" });
    }

    const newComment = { user_id, firstName, lastName, email, imageUrl, comment };
    await Post.updateOne({ _id: postId }, { $push: { comments: newComment } });
    res.status(200).json({ newComment });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

// get posts by single user
const getUserPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const post = await Post.find({ user_id: id }).sort({ createdAt: -1 });

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};
module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  addLike,
  removeLike,
  addComment,
  getUserPost,
};
