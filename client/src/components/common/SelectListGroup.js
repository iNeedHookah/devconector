import React from "react";

const SelectListGroup = ({
  id,
  name,
  value,
  error,
  info,
  onChange,
  options,
}) => {
  return (
    <div className="form-group">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control form-control-lg ${error ? "is-invalid" : ""}`}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectListGroup;
