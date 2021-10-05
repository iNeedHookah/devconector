import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCreds from "./ProfileCreds";
import ProfileAbout from "./ProfileAbout";
import ProfileGithub from "./ProfileGithub";
import Spinner from "../common/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfileByHandle } from "../../redux/actions/profileActions";

const Profile = () => {
  const profile = useSelector((state) => state.profile);
  const { handle } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    if (handle) {
      dispatch(getProfileByHandle(handle));
    }
  }, [dispatch, handle]);

  return (
    <div>
      <ProfileHeader />
      <ProfileAbout />
      <ProfileCreds />
      <ProfileGithub />
    </div>
  );
};

export default Profile;
