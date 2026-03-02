import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaGraduationCap className="navbar-icon" />
        <h1>Student DBMS</h1>
      </div>
      <p className="navbar-subtitle">Cloud-Powered Student Database Management</p>
    </nav>
  );
};

export default Navbar;
