import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import { getProfiles } from "../../redux/actions/profileActions";
import ProfileItem from "./ProfileItem";

const Profiles = () => {
  const profile = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfiles());
  }, [dispatch]);

  const { profiles, loading } = profile;
  let profileItems;

  if (profiles === null || loading) {
    profileItems = <Spinner />;
  } else {
    if (profiles.length > 0) {
      profileItems = profiles.map((profile) => (
        <ProfileItem key={profile._id} profile={profile} />
      ));
    } else {
      profileItems = <h4>No profiles found</h4>;
    }
  }

  return (
    <div className="profiles">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4 text-center">Developer profiles</h1>
            <p className="lead text-center">
              Browse and connect with deveopers
            </p>
            {profileItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
