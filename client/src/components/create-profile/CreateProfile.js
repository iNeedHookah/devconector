import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createProfile } from "../../redux/actions/profileActions";

const CreateProfile = () => {
  const currentProfile = useSelector((state) => state.profile);
  const errors = useSelector((state) => state.errors);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setCreateProfileState((prevState) => ({
      ...prevState,
      errors: errors,
    }));
  }, [errors]);

  const [createProfileState, setCreateProfileState] = useState({
    displaySocialInputs: false,
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
      handle: createProfileState.handle,
      company: createProfileState.company,
      website: createProfileState.website,
      location: createProfileState.location,
      status: createProfileState.status,
      skills: createProfileState.skills,
      githubusername: createProfileState.githubusername,
      bio: createProfileState.bio,
      twitter: createProfileState.twitter,
      facebook: createProfileState.facebook,
      instagram: createProfileState.instagram,
      youtube: createProfileState.youtube,
      linkedin: createProfileState.linkedin,
    };

    dispatch(createProfile(postData, history));
  };

  const onChange = (e) => {
    setCreateProfileState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(createProfileState.errors).forEach(
      () => (createProfileState.errors[e.target.id] = undefined)
    );
  };

  let socialInputs;
  if (createProfileState.displaySocialInputs) {
    socialInputs = (
      <div>
        <InputGroup
          placeholder="Twitter profile URL"
          name="twitter"
          id="twitter"
          icon="fab fa-twitter"
          value={createProfileState.twitter}
          onChange={onChange}
          error={createProfileState.errors.twitter}
        />
        <InputGroup
          placeholder="Facebook profile URL"
          name="facebook"
          id="facebook"
          icon="fab fa-facebook"
          value={createProfileState.facebook}
          onChange={onChange}
          error={createProfileState.errors.facebook}
        />
        <InputGroup
          placeholder="LinkedIn profile URL"
          name="linkedin"
          id="linkedin"
          icon="fab fa-linkedin"
          value={createProfileState.linkedin}
          onChange={onChange}
          error={createProfileState.errors.linkedin}
        />
        <InputGroup
          placeholder="YouTube profile URL"
          name="youtube"
          id="youtube"
          icon="fab fa-youtube"
          value={createProfileState.youtube}
          onChange={onChange}
          error={createProfileState.errors.youtube}
        />
        <InputGroup
          placeholder="Instagram profile URL"
          name="instagram"
          id="instagram"
          icon="fab fa-instagram"
          value={createProfileState.instagram}
          onChange={onChange}
          error={createProfileState.errors.instagram}
        />
      </div>
    );
  }

  return (
    <div className="create-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Create your profile</h1>
            <p className="lead text-center">
              Let's get some informations to make your profile stand out
            </p>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                id="handle"
                name="handle"
                placeholder="* Profile Handle"
                value={createProfileState.handle}
                onChange={onChange}
                error={createProfileState.errors.handle}
                info="A unique handle for your profile URL"
              />
              <SelectListGroup
                id="status"
                name="status"
                value={createProfileState.status}
                onChange={onChange}
                error={createProfileState.errors.status}
                options={options}
                info="Give us an idea of where you are at in your carrer"
              />
              <TextFieldGroup
                id="company"
                name="company"
                placeholder="Company"
                value={createProfileState.company}
                onChange={onChange}
                error={createProfileState.errors.company}
                info="Could be your own company or one you work for"
              />
              <TextFieldGroup
                id="website"
                name="website"
                placeholder="Website"
                value={createProfileState.website}
                onChange={onChange}
                error={createProfileState.errors.website}
                info="Could be your own website or company website"
              />
              <TextFieldGroup
                id="location"
                name="location"
                placeholder="Location"
                value={createProfileState.location}
                onChange={onChange}
                error={createProfileState.errors.location}
                info="City or city & state suggested (eg. Boston, MA)"
              />
              <TextFieldGroup
                id="skills"
                name="skills"
                placeholder="Skills"
                value={createProfileState.skills}
                onChange={onChange}
                error={createProfileState.errors.skills}
                info="Please use comma separated values (eg. HTML,CSS,React,Node.js)"
              />
              <TextFieldGroup
                id="githubusername"
                name="githubusername"
                placeholder="Github username"
                value={createProfileState.githubusername}
                onChange={onChange}
                error={createProfileState.errors.githubusername}
                info="If you want your latest repos and a Github link, include your username"
              />
              <TextAreaFieldGroup
                id="bio"
                name="bio"
                placeholder="Short bio"
                value={createProfileState.bio}
                onChange={onChange}
                error={createProfileState.errors.bio}
                info="Tell us a little about yourself"
              />
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateProfileState((prevState) => ({
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

export default CreateProfile;
