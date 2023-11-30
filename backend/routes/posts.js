const express = require("express");
const multer = require("multer");
const storage = new multer.memoryStorage();
const upload = multer({ storage });
const { getPosts, getPost, createPost, deletePost, updatePost, addLike, removeLike, addComment, getUserPost } = require("../controllers/posts");
const { getUser } = require("../controllers/users");

const router = express.Router();

// GET all Posts
router.get("/", getPosts);

// GET one Post
router.get("/:id", getPost);

// POST a new Post
router.post("/add", upload.single("image"), createPost);

// DELETE a Post
router.delete("/:id", deletePost);

// UPDATE a Post
router.patch("/:id", updatePost);

// add like
router.patch("/likes/add", addLike);
// remove like
router.patch("/likes/remove", removeLike);

// add comment
router.post("/comment/add", addComment);

//get post of a user
router.get("/user/:id", getUserPost);

module.exports = router;
