import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  createProfile,
  getCurrentProfile,
} from "../../redux/actions/profileActions";

const EditProfile = () => {
  const currentProfile = useSelector((state) => state.profile.profile);
  const errors = useSelector((state) => state.errors);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getCurrentProfile());

    setEditProfileState((prevState) => ({
      ...prevState,
      errors: errors,
    }));
  }, [errors, dispatch]);

  useEffect(() => {
    if (currentProfile !== null) {
      setEditProfileState((prevState) => ({
        ...prevState,
        ...currentProfile,
        ...currentProfile.socials,
      }));
    }
  }, [currentProfile]);

  const [editProfileState, setEditProfileState] = useState({
    displaySocialInputs: true,
    handle: "",
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    errors: {},
  });

  // Select options for status
  const options = [
    {
      label: "* Select professional status",
      value: 0,
    },
    {
      label: "Junior developer",
      value: "Junior developer",
    },
    {
      label: "Mid developer",
      value: "Mid developer",
    },
    {
      label: "Senior developer",
      value: "Senior developer",
    },
    {
      label: "Manager",
      value: "Manager",
    },
    {
      label: "Student",
      value: "Student",
    },
    {
      label: "Instructor or teacher",
      value: "Instructor or teacher",
    },
    {
      label: "Intern",
      value: "Intern",
    },
    {
      label: "Project manager",
      value: "Project manager",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    const postData = {
      handle: editProfileState.handle,
      company: editProfileState.company,
      website: editProfileState.website,
      location: editProfileState.location,
      status: editProfileState.status,
      skills: editProfileState.skills,
      githubusername: editProfileState.githubusername,
      bio: editProfileState.bio,
      twitter: editProfileState.twitter,
      facebook: editProfileState.facebook,
      instagram: editProfileState.instagram,
      youtube: editProfileState.youtube,
      linkedin: editProfileState.linkedin,
    };

    dispatch(createProfile(postData, history));
  };

  const onChange = (e) => {
    setEditProfileState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(editProfileState.errors).forEach(
      () => (editProfileState.errors[e.target.id] = undefined)
    );
  };

  let socialInputs;
  if (editProfileState.displaySocialInputs) {
    socialInputs = (
      <div>
        <InputGroup
          placeholder="Twitter profile URL"
          name="twitter"
          id="twitter"
          icon="fab fa-twitter"
          value={editProfileState.twitter}
          onChange={onChange}
          error={editProfileState.errors.twitter}
        />
        <InputGroup
          placeholder="Facebook profile URL"
          name="facebook"
          id="facebook"
          icon="fab fa-facebook"
          value={editProfileState.facebook}
          onChange={onChange}
          error={editProfileState.errors.facebook}
        />
        <InputGroup
          placeholder="LinkedIn profile URL"
          name="linkedin"
          id="linkedin"
          icon="fab fa-linkedin"
          value={editProfileState.linkedin}
          onChange={onChange}
          error={editProfileState.errors.linkedin}
        />
        <InputGroup
          placeholder="YouTube profile URL"
          name="youtube"
          id="youtube"
          icon="fab fa-youtube"
          value={editProfileState.youtube}
          onChange={onChange}
          error={editProfileState.errors.youtube}
        />
        <InputGroup
          placeholder="Instagram profile URL"
          name="instagram"
          id="instagram"
          icon="fab fa-instagram"
          value={editProfileState.instagram}
          onChange={onChange}
          error={editProfileState.errors.instagram}
        />
      </div>
    );
  }

  return (
    <div className="create-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Edit your profile</h1>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                id="handle"
                name="handle"
                placeholder="* Profile Handle"
                value={editProfileState.handle}
                onChange={onChange}
                error={editProfileState.errors.handle}
                info="A unique handle for your profile URL"
              />
              <SelectListGroup
                id="status"
                name="status"
                value={editProfileState.status}
                onChange={onChange}
                error={editProfileState.errors.status}
                options={options}
                info="Give us an idea of where you are at in your carrer"
              />
              <TextFieldGroup
                id="company"
                name="company"
                placeholder="Company"
                value={editProfileState.company}
                onChange={onChange}
                error={editProfileState.errors.company}
                info="Could be your own company or one you work for"
              />
              <TextFieldGroup
                id="website"
                name="website"
                placeholder="Website"
                value={editProfileState.website}
                onChange={onChange}
                error={editProfileState.errors.website}
                info="Could be your own website or company website"
              />
              <TextFieldGroup
                id="location"
                name="location"
                placeholder="Location"
                value={editProfileState.location}
                onChange={onChange}
                error={editProfileState.errors.location}
                info="City or city & state suggested (eg. Boston, MA)"
              />
              <TextFieldGroup
                id="skills"
                name="skills"
                placeholder="* Skills"
                value={editProfileState.skills}
                onChange={onChange}
                error={editProfileState.errors.skills}
                info="Please use comma separated values (eg. HTML,CSS,React,Node.js)"
              />
              <TextFieldGroup
                id="githubusername"
                name="githubusername"
                placeholder="Github username"
                value={editProfileState.githubusername}
                onChange={onChange}
                error={editProfileState.errors.githubusername}
                info="If you want your latest repos and a Github link, include your username"
              />
              <TextAreaFieldGroup
                id="bio"
                name="bio"
                placeholder="Short bio"
                value={editProfileState.bio}
                onChange={onChange}
                error={editProfileState.errors.bio}
                info="Tell us a little about yourself"
              />
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditProfileState((prevState) => ({
                      ...prevState,
                      displaySocialInputs: !prevState.displaySocialInputs,
                    }));
                  }}
                  className="btn btn-light"
                >
                  Add social network links
                </button>
                <span className="text-muted">Optional</span>
              </div>
              {socialInputs}
              <input
                type="submit"
                value="Submit"
                className="btn btn-primary btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
