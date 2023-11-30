import { Link } from "react-router-dom";
const ProfileWidget = (props) => {
  const user = props.user;

  return (
    <div className="profileWidget">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card shadow">
          <div className="text-center">
            <img src="/user_image.jpg" className="rounded-circle" width="80" />
          </div>

          <div className="mt-1 text-center">
            <h4 className="mb-0">{user.firstName + " " + user.lastName}</h4>
            <span className="text-muted d-block mb-2">{user.email}</span>
            <Link className="text-decoration-none mb-1 btn btn-primary rounded-pill px-3 py-1" to={"/profile/" + user._id}>
              View Profile
            </Link>

            <div className="d-flex justify-content-between align-items-center mt-4 px-4">
              <div className="stats">
                <h6 className="mb-0">Friends</h6>
                <span>
                  {user.friends && user.friends.length}
                  {!user.friends && 0}
                </span>
              </div>

              <div className="stats">
                <h6 className="mb-0">Posts</h6>
                <span>
                  {user.posts && user.posts.length}
                  {!user.posts && 0}
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
