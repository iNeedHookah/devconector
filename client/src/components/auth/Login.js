import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../../redux/actions/authActions";
import TextFieldGroup from "../../common/TextFieldGroup";

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
  }, [errors, auth, history]);

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
        <TextFieldGroup
          id="email"
          type="email"
          placeholder="Email Address"
          value={loginState.email}
          onChange={onChange}
          error={loginState.errors.email}
        />
        <TextFieldGroup
          id="password"
          type="password"
          placeholder="Password"
          value={loginState.password}
          onChange={onChange}
          error={loginState.errors.password}
        />
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};
export default Login;
