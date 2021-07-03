const validator = require("validator");
const isEmpty = require("./is-empty");

const validateLoginInput = (data) => {
  let errors = {};

  let { email, password } = data;

  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  errors = isValidEmail(errors, email);
  errors = isValidPassword(errors, password);

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const isValidEmail = (errors, email) => {
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required!";
    return errors;
  }

  // Not to be used for security reasons
  // If password is invalid, should return invalid credentials
  // if (!validator.isEmail(email)) {
  //   errors.email = "Email is invalid!";
  //   return errors;
  // }

  return errors;
};

const isValidPassword = (errors, password) => {
  if (validator.isEmpty(password)) {
    errors.password = "Password field is required!";
    return errors;
  }

  // Not to be used for security reasons
  // If password is invalid, should return invalid credentials
  // if (!validator.isLength(password, { min: 6, max: 30 })) {
  //   errors.password = "Password must be between 6 and 30 characthers!";
  //   return errors;
  // }

  return errors;
};

module.exports = validateLoginInput;
