import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import CreatePostWidget from "./CreatePostWidget";
const PostWidget = (props) => {
  const user = props.user;
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const [posts, setPosts] = useState(null);

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

  const updateLikes = async (postId, operation) => {
    if (operation == "add") {
      try {
        const userId = user._id;
        const updated_data = { userId, postId };
        const response = await fetch("/api/posts/likes/add", {
          method: "PATCH",
          body: JSON.stringify(updated_data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else if (operation == "remove") {
      try {
        const userId = user._id;
        const updated_data = { userId, postId };
        const response = await fetch("/api/posts/likes/remove", {
          method: "PATCH",
          body: JSON.stringify(updated_data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const handleUnlikePost = (e, targetId) => {
    e.preventDefault();
    const updatedPosts = posts.map((post) => {
      if (post._id === targetId) {
        // Use filter to remove the user from the likes array
        const updatedLikes = post.likes.filter((like) => like !== user._id);
        return { ...post, likes: updatedLikes };
      }
      return post;
    });
    setPosts(updatedPosts);
    const operation = "remove";
    updateLikes(targetId, operation);
    setError(null);
    // getAllPosts();
  };

  const handleLikePost = (e, targetId) => {
    e.preventDefault();
    const updatedPosts = posts.map((post) => {
      if (post._id === targetId) {
        // Use filter to remove the user from the likes array
        const updatedLikes = [...post.likes, user._id];
        return { ...post, likes: updatedLikes };
      }
      return post;
    });
    setPosts(updatedPosts);
    const operation = "add";
    updateLikes(targetId, operation);
    setError(null);
    // getAllPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
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
      alert("something went wrong.");
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setContent("");
      setImage("");
      setPreviewImage(null);
      getAllPosts();
      console.log("new post added");
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await fetch("/api/posts/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const handleCreateComment = () => {};

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="postWidget">
      {error && <div className="alert">{error}</div>}
      {/* to add post */}
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
              <button className="btn btn-primary" type="submit">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <br />
      {/* list of post */}
      <div className="createPost">
        <ul className="list-group list-group-light">
          {posts &&
            posts.map((post, index) => (
              <div className="post mb-4 shadow rounded-3" key={index}>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img src="/user_image.jpg" alt="" style={{ width: "45px", height: "45px" }} className="rounded-circle" />
                    <div className="ms-3">
                      <Link className="text-decoration-none text-dark fw-bold mb-1" to={"/profile/" + post.user_id}>
                        {post.firstName + " " + post.lastName}
                      </Link>
                      <p className="text-muted mb-0">{post.email}</p>
                    </div>
                  </div>
                  <Link className="text-decoration-none mb-1 btn btn-primary rounded-pill px-3 py-1" to={"/profile/" + post.user_id}>
                    View Profile
                  </Link>
                </li>
                {/* <li className="list-group-item d-flex justify-content-between align-items-center"> */}
                {/* <div className="d-flex align-items-center"> */}
                <li className="list-group-item content p-2">
                  <p className="mb-2">{post.content}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="post-image" style={{ maxWidth: "100%" }} />}
                </li>
                {/* </div> */}
                {/* </li> */}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="container d-flex p-0 align-items-center">
                    {post.likes.includes(user._id) && (
                      <button className="btn btn-primary btn-sm ms-auto rounded-pill" onClick={(e) => handleUnlikePost(e, post._id)}>
                        Unlike
                      </button>
                    )}
                    {!post.likes.includes(user._id) && (
                      <button className="btn btn-primary btn-sm ms-auto rounded-pill" onClick={(e) => handleLikePost(e, post._id)}>
                        Like
                      </button>
                    )}
                    {post.likes && post.likes.length}
                    {!post.likes && 0}
                    <form className="flex-grow-1 ms-3" onSubmit={handleCreateComment}>
                      <div className="input-group">
                        <textarea
                          className="form-control"
                          rows="1"
                          placeholder="Share your comment..."
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                        ></textarea>
                        <button className="btn btn-primary" type="submit">
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default PostWidget;
