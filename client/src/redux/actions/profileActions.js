import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES,
} from "./types";

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then((response) => {
      dispatch({
        type: GET_PROFILE,
        payload: response.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_PROFILE,
        payload: {},
      });
    });
};

// Create profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((response) => {
      history.push("/dashboard");
    })
    .catch((error) => {
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data,
      });
    });
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

// Add experience
export const addExperience = (expData, history) => (dispatch) => {
  axios
    .post("/api/profile/experience", expData)
    .then(() => {
      history.push("/dashboard");
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Add education
export const addEducation = (eduData, history) => (dispatch) => {
  axios
    .post("/api/profile/education", eduData)
    .then(() => {
      history.push("/dashboard");
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Delete experience
export const deleteExperience = (experienceId) => (dispatch) => {
  axios
    .delete(`/api/profile/experience/${experienceId}`)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Delete education
export const deleteEducation = (educationId) => (dispatch) => {
  axios
    .delete(`/api/profile/education/${educationId}`)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Get all profiles
export const getProfiles = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then((res) => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_PROFILES,
        payload: null,
      })
    );
};

// Get profile by handle
export const getProfileByHandle = (handle) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch(() =>
      dispatch({
        type: GET_PROFILE,
        payload: null,
      })
    );
};

// Delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (
    window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone!"
    )
  ) {
    axios
      .delete("/api/profile")
      .then(() => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        });
        dispatch({
          type: CLEAR_CURRENT_PROFILE,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  }
};
