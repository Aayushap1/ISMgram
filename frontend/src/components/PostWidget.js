import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import Post from "./Post";
const PostWidget = (props) => {
  const user = props.user;

  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  const getAllPosts = async () => {
    try {
      const response = await fetch("/api/posts/");
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
  }, []);

  return (
    <div className="postWidget">
      {error && <div className="alert">{error}</div>}
      {/* to add post */}
      <CreatePost user={user} setUser={props.setUser} posts={posts} setPosts={setPosts} />
      <br />
      {/* list of post */}
      <div className="listPost">
        <ul className="list-group list-group-light">{posts && posts.map((post) => <Post key={post._id} post={post} user={user} />)}</ul>
      </div>
    </div>
  );
};

export default PostWidget;
