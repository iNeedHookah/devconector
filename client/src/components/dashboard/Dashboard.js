import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentProfile } from "../../redux/actions/profileActions";
import Spinner from "../../common/Spiiner";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  let dashboardContent;

  if (currentProfile.profile === null || currentProfile.loading) {
    dashboardContent = <Spinner />;
  } else {
    // Check if logged in user has profile data
    if (Object.keys(currentProfile.profile).length > 0) {
      dashboardContent = <h4>TODO: DISPLAY PROFILE</h4>;
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
