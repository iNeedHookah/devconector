import React from "react";
import { useDispatch } from "react-redux";
import Moment from "react-moment";
import { deleteEducation as deleteEducationAction } from "../../redux/actions/profileActions";

const Education = ({ education }) => {
  const dispatch = useDispatch();

  const deleteEducation = (educationId) => {
    dispatch(deleteEducationAction(educationId));
  };

  const educationRows = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td>{edu.degree}</td>
      <td>{edu.fieldofstudy}</td>
      <td>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {edu.to !== null ? (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        ) : (
          "Present"
        )}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteEducation(edu._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="mt-4">
      <h4 className="mb-4">Education</h4>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th>Degree</th>
            <th>Field of study</th>
            <th>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educationRows}</tbody>
      </table>
    </div>
  );
};

export default Education;
