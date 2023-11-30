import { useState } from "react";
import { Link } from "react-router-dom";
const Post = (props) => {
  const user = props.user;

  const [post, setPost] = useState(props.post);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const [error, setError] = useState(null);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    const commentData = { postId: post._id, user_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, imageUrl: user.imageUrl, comment };
    const response = await fetch("/api/posts/comment/add", {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) {
      alert("something went wrong", json.error);
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setComment("");
      // update post state
      const updatedComments = [...post.comments, json.newComment];
      const updatedPost = { ...post, comments: updatedComments };
      setPost(updatedPost);
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
    if (post._id === targetId) {
      // Use filter to remove the user from the likes array
      const updatedLikes = post.likes.filter((like) => like !== user._id);
      const updatedPost = { ...post, likes: updatedLikes };
      setPost(updatedPost);
    }
    const operation = "remove";
    updateLikes(targetId, operation);
    setError(null);
  };

  const handleLikePost = (e, targetId) => {
    e.preventDefault();
    if (post._id === targetId) {
      // Use filter to remove the user from the likes array
      const updatedLikes = [...post.likes, user._id];
      const updatedPost = { ...post, likes: updatedLikes };
      setPost(updatedPost);
    }
    const operation = "add";
    updateLikes(targetId, operation);
    setError(null);
  };

  return (
    <div className="post mb-4 shadow rounded-3">
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
        {post.postImageUrl && <img src={post.postImageUrl} alt="post-image" style={{ maxWidth: "100%" }} />}
      </li>
      {/* </div> */}
      {/* </li> */}
      <li className="list-group-item d-flex">
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
      <button className="btn " onClick={() => setShowComments(!showComments)}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      {showComments && (
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="container d-flex p-0 align-items-center">
            <ul className="list-group list-group-light flex-grow-1">
              {post.comments &&
                post.comments.map((comment, index) => (
                  <div className="mb-2">
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src="/user_image.jpg" alt="" style={{ width: "45px", height: "45px" }} className="rounded-circle" />
                        <div className="ms-3">
                          <Link className="text-decoration-none text-dark fw-bold mb-1" to={"/profile/" + comment.user_id}>
                            {comment.firstName + " " + comment.lastName}
                          </Link>
                          <p className="text-muted mb-0">{comment.email}</p>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">{comment.comment}</li>
                  </div>
                ))}
            </ul>
          </div>
        </li>
      )}
    </div>
  );
};

export default Post;
