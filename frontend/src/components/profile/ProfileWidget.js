import { useState } from "react";
import { Link } from "react-router-dom";

const ProfileWidget = (props) => {
  const user = props.user;
  const profile_user = props.profile_user;

  const updateFriends = async (userId1, userId2, operation) => {
    // console.log(userId1, userId2, operation);
    if (operation == "add") {
      try {
        const updated_data = { userId1, userId2 };
        const response = await fetch("/api/users/friends/add", {
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
        const updated_data = { userId1, userId2 };
        const response = await fetch("/api/users/friends/remove", {
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

  const handleRemoveFriend = (e, targetId) => {
    e.preventDefault();
    const updatedFriends = profile_user.friends.filter((id) => id !== user._id);
    const updatedUser = { ...profile_user, friends: updatedFriends };
    props.setProfile_user(updatedUser);
    const userId1 = user._id;
    const userId2 = targetId;
    const operation = "remove";
    updateFriends(userId1, userId2, operation);
    // console.log("updated", updatedFriends);
  };

  const handleMakeFriend = (e, targetId) => {
    e.preventDefault();
    const updatedFriends = [...profile_user.friends, user._id];
    const updatedUser = { ...profile_user, friends: updatedFriends };
    props.setProfile_user(updatedUser);
    const userId1 = user._id;
    const userId2 = targetId;
    const operation = "add";
    updateFriends(userId1, userId2, operation);
    // console.log(updatedFriends);
  };

  return (
    <div className="profileWidget">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card shadow">
          <div className="text-center">
            <img src="/user_image.jpg" className="rounded-circle" width="80" />
          </div>

          <div className="mt-1 text-center">
            <h4 className="mb-0">{profile_user.firstName + " " + profile_user.lastName}</h4>
            <span className="text-muted d-block mb-2">{profile_user.email}</span>
            <Link className="text-decoration-none btn btn-primary rounded-pill px-3 py-1" to={"/profile/" + profile_user._id}>
              View Profile
            </Link>{" "}
            {profile_user._id !== user._id && (
              <>
                {profile_user.friends && profile_user.friends.includes(user._id) ? (
                  <button className="btn btn-primary ms-auto rounded-pill px-3 py-1" onClick={(e) => handleRemoveFriend(e, profile_user._id)}>
                    Remove Friend
                  </button>
                ) : (
                  <button className="btn btn-primary ms-auto rounded-pill px-3 py-1" onClick={(e) => handleMakeFriend(e, profile_user._id)}>
                    Add Friend
                  </button>
                )}
              </>
            )}
            <div className="d-flex justify-content-between align-items-center mt-4 px-4">
              <div className="stats">
                <h6 className="mb-0">Friends</h6>
                <span>
                  {profile_user.friends && profile_user.friends.length}
                  {!profile_user.friends && 0}
                </span>
              </div>

              <div className="stats">
                <h6 className="mb-0">Posts</h6>
                <span>
                  {profile_user.posts && profile_user.posts.length}
                  {!profile_user.posts && 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
