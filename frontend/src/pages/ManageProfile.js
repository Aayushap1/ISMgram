import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileWidget from "../components/profile/ProfileWidget";
import PostWidget from "../components/manage-profile/PostWidget";
import FriendsWidget from "../components/profile/FriendsWidget";

const Home = () => {
  const navigate = useNavigate();

  if (!document.cookie) {
    console.log("Cookie not found.");
    window.location.replace("/login");
  }
  const user_id = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="))
    .split("=")[1];
  if (!user_id) {
    console.log("Cookie not found.");
    navigate("/login");
  }

  //   console.log("user", user_id);

  const [user, setUser] = useState({});

  const getUserData = async () => {
    try {
      const response = await fetch("/api/users/" + user_id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [user_id]);

  return (
    <div className="home mx-4">
      {!user._id && (
        <div className="row justify-content-center">
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
        </div>
      )}
      {user._id && (
        <>
          <Navbar user={user} />
          {/* {!user._id && "loading"} */}
          <div className="d-flex">
            <div className="w-25 p-3">
              <ProfileWidget user={user} profile_user={user} setProfile_user={setUser} />
            </div>
            <div className="w-50 p-3">
              <PostWidget user={user} profile_user_id={user_id} setUser={setUser} />
            </div>
            <div className="w-25 p-3">
              <FriendsWidget user={user} profile_user={user} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
