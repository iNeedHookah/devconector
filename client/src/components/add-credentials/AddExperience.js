import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { useDispatch, useSelector } from "react-redux";
import { addExperience } from "../../redux/actions/profileActions";

const AddExperience = () => {
  const errors = useSelector((state) => state.errors);

  const history = useHistory();
  const dispatch = useDispatch();

  const [experience, setExperience] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
    errors: {},
    disabled: false,
  });

  useEffect(() => {
    setExperience((prevState) => ({
      ...prevState,
      errors: errors,
    }));
  }, [errors]);

  const onSubmit = (e) => {
    e.preventDefault();

    const expData = {
      company: experience.company,
      title: experience.title,
      location: experience.location,
      from: experience.from,
      to: experience.to,
      current: experience.current,
      description: experience.description,
    };

    dispatch(addExperience(expData, history));
  };

  const onChange = (e) => {
    setExperience((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(experience.errors).forEach(() => {
      experience.errors[e.target.id] = undefined;
    });
  };

  const onCheck = () => {
    setExperience((prevState) => ({
      ...prevState,
      disabled: !prevState.disabled,
      current: !prevState.current,
    }));
  };

  return (
    <div className="add-experience">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light mb-4">
              Go back
            </Link>
            <h1 className="display-4 text-center">Add experience</h1>
            <p className="lead text-center">
              Add any job or position that you have had in the past or current
            </p>
            <small className="d-block pb-3">* fields are required</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="* Company"
                id="company"
                name="company"
                value={experience.company}
                onChange={onChange}
                error={experience.errors.company}
              />
              <TextFieldGroup
                placeholder="* Job title"
                id="title"
                name="title"
                value={experience.title}
                onChange={onChange}
                error={experience.errors.title}
              />
              <TextFieldGroup
                placeholder="Location"
                id="location"
                name="location"
                value={experience.location}
                onChange={onChange}
                error={experience.errors.location}
              />
              <h6>From date</h6>
              <TextFieldGroup
                id="from"
                name="from"
                type="date"
                value={experience.from}
                onChange={onChange}
                error={experience.errors.from}
              />
              <h6>To date</h6>
              <TextFieldGroup
                id="to"
                name="to"
                type="date"
                value={experience.to}
                onChange={onChange}
                error={experience.errors.to}
                disabled={experience.disabled ? "disabled" : ""}
              />
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="current"
                  id="current"
                  value={experience.current}
                  checked={experience.current}
                  onChange={onCheck}
                />
                <label htmlFor="current" className="form-check-label">
                  Current job
                </label>
              </div>
              <TextAreaFieldGroup
                id="description"
                name="description"
                value={experience.description}
                placeholder="Job description"
                onChange={onChange}
                error={experience.errors.description}
                info="Tell us about the position"
              />
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExperience;
