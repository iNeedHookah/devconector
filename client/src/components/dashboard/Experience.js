import React from "react";
import { useDispatch } from "react-redux";
import Moment from "react-moment";
import { deleteExperience as deleteExperienceAction } from "../../redux/actions/profileActions";

const Experience = ({ experience }) => {
  const dispatch = useDispatch();

  const deleteExperience = (experienceId) => {
    dispatch(deleteExperienceAction(experienceId));
  };

  const experienceRows = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td>{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
        {exp.to !== null ? (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        ) : (
          "Present"
        )}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteExperience(exp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="mt-4">
      <h4 className="mb-4">Experience</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experienceRows}</tbody>
      </table>
    </div>
  );
};

export default Experience;
