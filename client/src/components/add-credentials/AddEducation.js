import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { useDispatch, useSelector } from "react-redux";
import { addEducation } from "../../redux/actions/profileActions";

const AddEducation = () => {
  const errors = useSelector((state) => state.errors);

  const history = useHistory();
  const dispatch = useDispatch();

  const [education, setEducation] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
    errors: {},
    disabled: false,
  });

  useEffect(() => {
    setEducation((prevState) => ({
      ...prevState,
      errors: errors,
    }));
  }, [errors]);

  const onSubmit = (e) => {
    e.preventDefault();

    const eduData = {
      school: education.school,
      degree: education.degree,
      fieldofstudy: education.fieldofstudy,
      from: education.from,
      to: education.to,
      current: education.current,
      description: education.description,
    };

    dispatch(addEducation(eduData, history));
  };

  const onChange = (e) => {
    setEducation((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(education.errors).forEach(() => {
      education.errors[e.target.id] = undefined;
    });
  };

  const onCheck = () => {
    setEducation((prevState) => ({
      ...prevState,
      disabled: !prevState.disabled,
      current: !prevState.current,
    }));
  };

  return (
    <div className="add-education">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light mb-4">
              Go back
            </Link>
            <h1 className="display-4 text-center">Add education</h1>
            <p className="lead text-center">
              Add any school, bootcamp, etc. that you have attended
            </p>
            <small className="d-block pb-3">* fields are required</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="* School"
                id="school"
                name="school"
                value={education.school}
                onChange={onChange}
                error={education.errors.school}
              />
              <TextFieldGroup
                placeholder="* Degree"
                id="degree"
                name="degree"
                value={education.degree}
                onChange={onChange}
                error={education.errors.degree}
              />
              <TextFieldGroup
                placeholder="* Field of study"
                id="fieldofstudy"
                name="fieldofstudy"
                value={education.fieldofstudy}
                onChange={onChange}
                error={education.errors.fieldofstudy}
              />
              <h6>From date</h6>
              <TextFieldGroup
                id="from"
                name="from"
                type="date"
                value={education.from}
                onChange={onChange}
                error={education.errors.from}
              />
              <h6>To date</h6>
              <TextFieldGroup
                id="to"
                name="to"
                type="date"
                value={education.to}
                onChange={onChange}
                error={education.errors.to}
                disabled={education.disabled ? "disabled" : ""}
              />
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="current"
                  id="current"
                  value={education.current}
                  checked={education.current}
                  onChange={onCheck}
                />
                <label htmlFor="current" className="form-check-label">
                  Current education
                </label>
              </div>
              <TextAreaFieldGroup
                id="description"
                name="description"
                value={education.description}
                placeholder="Education description"
                onChange={onChange}
                error={education.errors.description}
                info="Tell us about the program that you were in"
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

export default AddEducation;
