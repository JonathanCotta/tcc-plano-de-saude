// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    profile: {},
    isLogged: false
};

// ==============================|| SLICE - DIALOG ||============================== //

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.isLogged = true;
            state.profile = action.payload;
        },
        clearUser: (state) => {
            state.isLogged = initialState.isLogged;
            state.profile = initialState.profile;
        }
    }
});

export default user.reducer;
export const { setUser, clearUser } = user.actions;
