import React, { useState } from "react";

const Login = () => {
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    console.log(e);
    setLoginState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      emal: loginState.email,
      password: loginState.password,
    };

    console.log(user);
  };

  return (
    <section className="container">
      <div className="alert alert-danger">Invalid Credentials</div>

      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into your account
      </p>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={loginState.email}
            onChange={onChange}
            id="email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            minlength="6"
            value={loginState.password}
            onChange={onChange}
            id="password"
          />
        </div>
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Don't have an account? <a href="register.html">Sign Up</a>
      </p>
    </section>
  );
};

export default Login;
