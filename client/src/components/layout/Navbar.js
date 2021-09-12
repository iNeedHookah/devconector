import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import { useHistory } from "react-router-dom";
import { clearCurrentProfile } from "../../redux/actions/profileActions";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(clearCurrentProfile());
    dispatch(logoutUser(history));
  };

  const authLinks = (
    <ul>
      <li>
        <a href onClick={onLogoutClick} className="nav-link">
          <img
            src={auth.user.avatar}
            alt={auth.user.name}
            style={{ width: "25px", marginRight: "5px" }}
            className="rounded-circle"
            title="You must have a gravatar linked to your email to display an immage"
          />
          Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1 className="mb-0">
        <Link to="/dashboard">
          {" "}
          <i className="fas fa-code"></i> DevConnector{" "}
        </Link>
      </h1>
      {auth.isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
