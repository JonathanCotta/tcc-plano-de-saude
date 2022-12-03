// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    open: false,
    message: ''
};

// ==============================|| SLICE - DIALOG ||============================== //

const dialog = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        openDialog: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
        },
        closeDialog: (state) => {
            // eslint-disable-next-line no-unused-vars
            state.open = initialState.open;
            state.message = initialState.message;
        }
    }
});

export default dialog.reducer;
export const { openDialog, closeDialog } = dialog.actions;
