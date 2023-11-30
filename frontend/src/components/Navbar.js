import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate("/profile/" + search);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    document.cookie = "user_id=";
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg shadow px-3 py-1">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <h2>
            <b>ISM-Gram</b>
          </h2>
        </Link>
        <form className="d-flex" role="search" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {user.firstName + " " + user.lastName}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/manage-profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
