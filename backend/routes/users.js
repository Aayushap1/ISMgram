const express = require("express");
const { getUsers, getUser, createUser, loginUser, deleteUser, updateUser, getFriendDetails, addFriend, removeFriend } = require("../controllers/users");

const router = express.Router();

// GET all Users
router.get("/", getUsers);

// GET one User
router.get("/:id", getUser);

// POST a new User
router.post("/register", createUser);

// POST for login user
router.post("/login", loginUser);

// DELETE a User
router.delete("/:id", deleteUser);

// UPDATE a User
router.patch("/:id", updateUser);

// Get friends detail
router.get("/friends/:id", getFriendDetails);

// add friend
router.patch("/friends/add", addFriend);

// remove friends
router.patch("/friends/remove", removeFriend);

module.exports = router;
