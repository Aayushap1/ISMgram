const User = require("../models/users");
const mongoose = require("mongoose");

// get all users
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

// get a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// create a new user
const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // add to the database
  try {
    const user = await User.create({ firstName, lastName, email, password });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }
  res.status(200).json(user);
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

const getFriendDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }

    const friendIds = user.friends;
    const users = await User.find({ _id: { $in: friendIds } });
    return res.status(200).json(users);
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

const addFriend = async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    await User.updateOne({ _id: userId1 }, { $push: { friends: userId2 } });
    await User.updateOne({ _id: userId2 }, { $push: { friends: userId1 } });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

const removeFriend = async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    await User.updateOne({ _id: userId1 }, { $pull: { friends: userId2 } });
    await User.updateOne({ _id: userId2 }, { $pull: { friends: userId1 } });
  } catch {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getFriendDetails,
  addFriend,
  removeFriend,
};
