import React from "react";
import HashLoader from "react-spinners/HashLoader";
import "./loading.css"; // Import your CSS file

const Loading_page = () => {
  return (
    <div className="container">
      <HashLoader color="#36d7b7" loading size={100} speedMultiplier={0.5} />
    </div>
  );
};

export default Loading_page;
