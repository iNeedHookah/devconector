const validator = require("validator");
const isEmpty = require("./is-empty");

const validateProfileInput = (data) => {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 charachters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "URL is not valid";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Twitter URL is not valid";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "YouTube URL is not valid";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Facebook URL is not valid";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Instagram URL is not valid";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "LinkedIn URL is not valid";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateProfileInput;
