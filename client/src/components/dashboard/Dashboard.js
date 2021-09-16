import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentProfile,
  deleteAccount,
} from "../../redux/actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  const onDeleteClick = () => {
    dispatch(deleteAccount());
  };

  let dashboardContent;

  if (currentProfile.profile === null || currentProfile.loading) {
    dashboardContent = <Spinner />;
  } else {
    // Check if logged in user has profile data
    if (Object.keys(currentProfile.profile).length > 0) {
      dashboardContent = (
        <div>
          <p className="lead text-muted">
            Welcome{" "}
            <Link to={`/profile/${currentProfile.profile.handle}`}>
              {auth.user.name}
            </Link>
            <ProfileActions />
            <Experience experience={currentProfile.profile.experience} />
            <Education education={currentProfile.profile.education} />
            <div style={{ marginBottom: "60px" }} />
            <button onClick={onDeleteClick} className="btn btn-danger">
              Delete my account
            </button>
          </p>
        </div>
      );
    } else {
      // User is logged in but has no profile
      dashboardContent = (
        <div>
          <p className="lead text-muted">Welcome {auth.user.name}</p>
          <p>You have not yet set up a profile! Please add some info</p>
          <Link to="/create-profile" className="btn btn-lg btn-primary">
            Create profile
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            {dashboardContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
