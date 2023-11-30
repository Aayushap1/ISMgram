import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = { firstName, lastName, email, password };
    const response = await fetch("/api/users/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      if (json.error.substring(1, 6) === "11000") {
        setError("Email already exist.");
      } else {
        setError(json.error);
      }
    }
    if (response.ok) {
      setError(null);
      navigate("/login");
      // console.log("new user added");
    }
  };

  return (
    <div className="register">
      {/* <!-- Section: Design Block --> */}
      <section className="background-radial-gradient overflow-hidden">
        <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: "hsl(218, 81%, 95%)" }}>
                ISM-Gram <br />
                {/* <span style={{ color: "hsl(218, 81%, 75%)" }}>for your business</span> */}
              </h1>
              <p className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                ISM-Gram is your gateway to a world of social engagement. It's more than just a website; it's a community where you can create, share, and be a part of a network that celebrates your individuality. Welcome to ISM-Gram, where connections flourish, and your online journey begins.{" "}
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
              <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleRegister}>
                    {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                            }}
                            placeholder="First name"
                            required
                          />
                          <label className="floatingInput">First name</label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                            }}
                            placeholder="Last name"
                            required
                          />
                          <label className="floatingInput">Last name</label>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Email input --> */}
                    <div className="form-floating mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => {
                          setemail(e.target.value);
                        }}
                        placeholder="Email address"
                        required
                      />
                      <label className="floatingInput">Email address</label>
                    </div>

                    {/* <!-- Password input --> */}
                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        placeholder="Password"
                        required
                      />
                      <label className="floatingInput">Password</label>
                    </div>

                    {/* <!-- Submit button --> */}
                    <button type="submit" className="btn btn-primary btn-block mb-2">
                      Sign up
                    </button>
                    <p className="fw-bold mt-2 pt-1 mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="link-danger">
                        Login
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Section: Design Block --> */}
    </div>
  );
};

export default Register;
