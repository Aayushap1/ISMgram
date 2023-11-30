const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    postImageUrl: {
      type: String,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        user_id: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          default: "",
        },
        comment: {
          type: String,
          required: true,
        },
        default: {},
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
