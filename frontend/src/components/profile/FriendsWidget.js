import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const FriendsWidget = (props) => {
  //logged in user
  const user = props.user;
  const [userFriends, setUserFriends] = useState([]);

  //profile user
  const profile_user = props.profile_user;

  // details of profile user friends
  const [friends, setFriends] = useState([]);

  const getAllFriendsData = async () => {
    try {
      const response = await fetch("/api/users/friends/" + profile_user._id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const users = await response.json();
      setFriends(users);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
    const updatedFriends = userFriends.filter((id) => id !== targetId);
    if (updatedFriends) {
      setUserFriends(updatedFriends);
    } else {
      setUserFriends([]);
    }
    const userId1 = user._id;
    const userId2 = targetId;
    const operation = "remove";
    updateFriends(userId1, userId2, operation);
    // console.log("updated", updatedFriends);
  };

  const handleMakeFriend = (e, targetId) => {
    e.preventDefault();
    const updatedFriends = [...userFriends, targetId];
    setUserFriends(updatedFriends);
    const userId1 = user._id;
    const userId2 = targetId;
    const operation = "add";
    updateFriends(userId1, userId2, operation);
    // console.log(updatedFriends);
  };

  useEffect(() => {
    // When the component mounts or when props.user changes, update userFriends.
    if (props.user && props.user.friends) {
      setUserFriends(props.user.friends);
    }
  }, [props.user]);

  useEffect(() => {
    if (profile_user && profile_user._id) {
      getAllFriendsData();
    }
  }, [profile_user._id]);

  return (
    <div className="friendsWidget shadow rounded-3 p-3">
      <h5>Friend List</h5>
      <ul className="list-group list-group-light">
        {friends &&
          friends.map((friend) => (
            <li key={friend._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/user_image.jpg" alt="" style={{ width: "45px", height: "45px" }} className="rounded-circle" />
                <div className="ms-3">
                  <Link className="text-decoration-none text-dark fw-bold mb-1" to={"/profile/" + friend._id}>
                    {friend.firstName + " " + friend.lastName}
                  </Link>
                  <p className="text-muted mb-0">{friend.email}</p>
                </div>
              </div>
              {user._id !== friend._id && (
                <>
                  {userFriends && userFriends.includes(friend._id) ? (
                    <button className="btn btn-primary ms-auto rounded-pill px-3 py-1" onClick={(e) => handleRemoveFriend(e, friend._id)}>
                      Remove
                    </button>
                  ) : (
                    <button className="btn btn-primary ms-auto rounded-pill px-3 py-1" onClick={(e) => handleMakeFriend(e, friend._id)}>
                      Add
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FriendsWidget;
