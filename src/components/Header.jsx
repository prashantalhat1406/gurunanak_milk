import React from "react";
import "../styles/header-style.css";

const Header = ({ name }) => {
  return (
    <header className="app-header-curved">
      <h1>{name}</h1>
    </header>
  );
};

export default Header;
