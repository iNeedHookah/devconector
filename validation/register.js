const validator = require("validator");
const isEmpty = require("./is-empty");

const validateRegisterInput = (data) => {
  let errors = {};

  let { name, email, password, confirmPassword } = data;

  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  confirmPassword = !isEmpty(confirmPassword) ? confirmPassword : "";

  errors = isValidName(errors, name);
  errors = isValidEmail(errors, email);
  errors = isValidPassword(errors, password, confirmPassword);

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const isValidName = (errors, name) => {
  if (validator.isEmpty(name)) {
    errors.name = "Name field is required!";
    return errors;
  }

  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characthers!";
    return errors;
  }

  return errors;
};

const isValidEmail = (errors, email) => {
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required!";
    return errors;
  }

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid!";
    return errors;
  }

  return errors;
};

const isValidPassword = (errors, password, confirmPassword) => {
  if (validator.isEmpty(password)) {
    errors.password = "Password field is required!";
    return errors;
  }

  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characthers!";
    return errors;
  }

  const regex = new RegExp(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\/;':"-]).{8,}$/
  );

  const validPassword = regex.test(password);
  if (!validPassword) {
    errors.password =
      "Password must contain at least one special characther, contain a capital letter and be at least 8 charatchers long!";
    return errors;
  }

  if (validator.isEmpty(confirmPassword)) {
    errors.confirmPassword = "Confirm password field is required!";
    return errors;
  }

  if (!validator.equals(password, confirmPassword)) {
    errors.confirmPassword = "Passwords must match!";
    return errors;
  }

  return errors;
};

module.exports = validateRegisterInput;
