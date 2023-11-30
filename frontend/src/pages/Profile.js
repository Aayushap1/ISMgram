import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileWidget from "../components/profile/ProfileWidget";
import PostWidget from "../components/profile/PostWidget";
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

  const profile_user_id = useParams().id;
  if (!profile_user_id) {
    console.log("user not found.");
    alert("user not found.");
  }

  const [user, setUser] = useState({});

  const [profile_user, setProfile_user] = useState({});

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

  const getProfileUserData = async () => {
    try {
      const response = await fetch("/api/users/" + profile_user_id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      setProfile_user(userData);
    } catch (error) {
      // console.error("Fetch error:", error);
      alert("User Not Found.");
    }
  };
  useEffect(() => {
    getUserData();
    getProfileUserData();
  }, [profile_user_id]);

  return (
    <div className="home mx-4">
      {!user._id && !profile_user._id && (
        <div className="row justify-content-center">
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
          <div className="spinner-grow text-primary my-5 mx-3" role="status"></div>
        </div>
      )}
      {!profile_user}
      {user._id && profile_user._id && (
        <>
          <Navbar user={user} />
          {/* {!user._id && "loading"} */}
          <div className="d-flex">
            <div className="w-25 p-3">
              <ProfileWidget user={user} profile_user={profile_user} setProfile_user={setProfile_user} />
            </div>
            <div className="w-50 p-3">
              <PostWidget user={user} profile_user_id={profile_user_id} />
            </div>
            <div className="w-25 p-3">
              <FriendsWidget user={user} profile_user={profile_user} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
