import "./App.css";

import { Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { logoutUser, setCurrentUser } from "./redux/actions/authActions";

import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import Dashboard from "./components/dashboard/Dashboard";
import { clearCurrentProfile } from "./redux/actions/profileActions";

import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <Route exact path="/">
          <Landing />
        </Route>
        <div className="container">
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute exact path="/create-profile">
            <CreateProfile />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-profile">
            <EditProfile />
          </PrivateRoute>
          <PrivateRoute exact path="/add-experience">
            <AddExperience />
          </PrivateRoute>
          <PrivateRoute exact path="/add-education">
            <AddEducation />
          </PrivateRoute>
          <Route exact path="/profiles">
            <Profiles />
          </Route>
          <Route exact path="/profile/:handle">
            <Profile />
          </Route>
        </div>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
