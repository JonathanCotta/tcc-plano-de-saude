// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    user: {},
    isLogged: false
};

// ==============================|| SLICE - DIALOG ||============================== //

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.isLogged = true;
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.isLogged = initialState.isLogged;
            state.user = initialState.user;
        }
    }
});

export default user.reducer;
export const { setUser, clearUser } = user.actions;
