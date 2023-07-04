import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'authenticate',
    initialState: {
        token: '',
        email: ''
    },

    reducers: {
        AUTHENTICATE: (state, action) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
        },
        KEPTAUTHENTICATED: (state, action) => {
            state.token = localStorage.getItem('token');
            state.email = localStorage.getItem('email');
        },
        LOGOUT: (state, action) => {
            console.log('we logged out');
            state.token = '';
            state.email = '';

            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('expiryDate');
        }
    }
});

export const { AUTHENTICATE, KEPTAUTHENTICATED, LOGOUT } = authSlice.actions;
export default authSlice.reducer;