import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
const PostWidget = (props) => {
  const user = props.user;

  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  const getAllPosts = async () => {
    try {
      const response = await fetch("/api/posts/user/" + props.profile_user_id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      setError(error);
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [props.profile_user_id]);

  return (
    <div className="postWidget">
      {/* {error && <div className="alert">{error}</div>} */}
      {/* list of post */}
      <div className="listPost">
        <ul className="list-group list-group-light">{posts && posts.map((post) => <Post key={post._id} post={post} posts={posts} setPosts={setPosts} user={user} setUser={props.setUser} />)}</ul>
      </div>
    </div>
  );
};

export default PostWidget;
