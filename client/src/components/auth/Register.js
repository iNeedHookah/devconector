import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/actions/authActions";
import TextFieldGroup from "../../common/TextFieldGroup";

const Register = () => {
  const auth = useSelector((state) => state.auth);
  const errors = useSelector((state) => state.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const [registerState, setRegisterState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: {},
  });

  useEffect(() => {
    setRegisterState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  }, [errors, auth]);

  const onChange = (e) => {
    setRegisterState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(registerState.errors).forEach(
      () => (registerState.errors[e.target.id] = undefined)
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: registerState.name,
      email: registerState.email,
      password: registerState.password,
      confirmPassword: registerState.confirmPassword,
    };

    dispatch(registerUser(newUser, history));
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form noValidate onSubmit={onSubmit} className="form">
        <TextFieldGroup
          id="name"
          type="text"
          placeholder="Name"
          value={registerState.name}
          onChange={onChange}
          error={registerState.errors.name}
        />
        <TextFieldGroup
          id="email"
          type="email"
          placeholder="Email Address"
          value={registerState.email}
          onChange={onChange}
          error={registerState.errors.email}
          info="This site uses Gravatar, so if you want a profile image, use a
            Gravatar email"
        />
        <TextFieldGroup
          id="password"
          type="password"
          placeholder="Password"
          value={registerState.password}
          onChange={onChange}
          error={registerState.errors.password}
        />
        <TextFieldGroup
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={registerState.confirmPassword}
          onChange={onChange}
          error={registerState.errors.confirmPassword}
        />
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default Register;
