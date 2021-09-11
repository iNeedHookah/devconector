import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../../redux/actions/authActions";

const Login = () => {
  const auth = useSelector((state) => state.auth);
  const errors = useSelector((state) => state.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
    errors: {},
  });

  useEffect(() => {
    setLoginState((prevState) => ({
      ...prevState,
      errors: errors,
    }));

    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  }, [errors, auth]);

  const onChange = (e) => {
    setLoginState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    Object.keys(loginState.errors).forEach(
      () => (loginState.errors[e.target.id] = undefined)
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: loginState.email,
      password: loginState.password,
    };

    dispatch(loginUser(user));
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into your account
      </p>
      {loginState.errors.credentials && (
        <div className="invalid-feedback d-block">
          {loginState.errors.credentials}
        </div>
      )}
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={loginState.email}
            onChange={onChange}
            className={`form-control form-control-lg ${
              loginState.errors.email ? "is-invalid" : ""
            }`}
          />
          {loginState.errors.email && (
            <div className="invalid-feedback">{loginState.errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={loginState.password}
            onChange={onChange}
            className={`form-control form-control-lg ${
              loginState.errors.password ? "is-invalid" : ""
            }`}
          />
          {loginState.errors.password && (
            <div className="invalid-feedback">{loginState.errors.password}</div>
          )}
        </div>
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default Login;
