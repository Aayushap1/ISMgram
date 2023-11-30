import React from "react";
import { useState } from "react";

const CreatePostWidget = (props) => {
  const user = props.user;
  const [isPosting, setIsPosting] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsPosting(1);
    const formData = new FormData();
    formData.append("key_three", "Thrid value");
    formData.append("user_id", user._id);
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);
    formData.append("imageUrl", user.imageUrl);
    formData.append("content", content);
    formData.append("image", image);
    const response = await fetch("/api/posts/add", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (!response.ok) {
      setIsPosting(null);
      alert("something went wrong.");
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setContent("");
      setImage("");
      setPreviewImage(null);
      setIsPosting(null);
      // update posts state
      const updatedPosts = [json, ...props.posts];
      props.setPosts(updatedPosts);
      //update user state
      const userPosts = [...user.posts, json._id];
      const updatedUser = { ...user, posts: userPosts };
      props.setUser(updatedUser);
      console.log("new post added");
    }
  };

  return (
    <div className="createPost rounded-3 shadow p-2">
      <div className="container d-flex p-2">
        <div className="me-2">
          <img src="/user_image.jpg" className="rounded-circle" alt="" style={{ width: "45px", height: "45px" }} />
        </div>
        <form className="flex-grow-1" onSubmit={handleCreatePost}>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          ></textarea>
          {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: "100%" }} />}
          <div className="input-group">
            <input type="file" name="image" className="form-control" onChange={handleInputImage} accept="image/*" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
            {!isPosting && (
              <button className="btn btn-primary" type="submit">
                Post
              </button>
            )}
            {isPosting && (
              <button className="btn btn-primary" disabled>
                Posting{" "}
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostWidget;
