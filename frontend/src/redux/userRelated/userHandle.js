import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

const REACT_APP_BASE_URL = "http://localhost:5000";

// Helper function to extract error message
const extractErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    return error.message || "An unknown error occurred.";
};

export const loginUser = (fields, role) => async (dispatch) => {
    if (!role) {
        console.error("Role is undefined or invalid.");
        dispatch(authError("Invalid role provided."));
        return;
    }

    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message || "Login failed."));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    if (!role) {
        console.error("Role is undefined or invalid.");
        dispatch(authError("Invalid role provided."));
        return;
    }

    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        } else if (result.data.school) {
            dispatch(stuffAdded());
        } else {
            dispatch(authFailed(result.data.message || "Registration failed."));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    if (!id || !address) {
        console.error("Invalid ID or address provided.");
        dispatch(getError("Invalid ID or address."));
        return;
    }

    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        } else {
            dispatch(getFailed("Failed to fetch user details."));
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
};

 export const deleteUser = (id, address) => async (dispatch) => {
     dispatch(getRequest());

     try {
         const result = await axios.delete(`${REACT_APP_BASE_URL}/${address}/${id}`);
         if (result.data.message) {
             dispatch(getFailed(result.data.message));
         } else {
             dispatch(getDeleteSuccess());
         }
     } catch (error) {
         dispatch(getError(error));
     }
    }

export const updateUser = (fields, id, address) => async (dispatch) => {
    if (!id || !address) {
        console.error("Invalid ID or address provided.");
        dispatch(getError("Invalid ID or address."));
        return;
    }

    dispatch(getRequest());

    try {
        const result = await axios.put(`${REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
};

export const addStuff = (fields, address) => async (dispatch) => {
    if (!address) {
        console.error("Invalid address provided.");
        dispatch(authError("Invalid address."));
        return;
    }

    dispatch(authRequest());

    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};
