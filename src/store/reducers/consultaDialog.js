// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    open: false,
    message: '',
    action: '',
    consultaId: ''
};

// ==============================|| SLICE - CONSULTA DIALOG ||============================== //

const dialog = createSlice({
    name: 'consultaDialog',
    initialState,
    reducers: {
        openConsultaDialog: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.action = action.payload.action;
            state.consultaId = action.payload.consultaId;
        },
        closeConsultaDialog: (state) => {
            state.open = initialState.open;
            state.message = initialState.message;
            state.action = initialState.action;
            state.consultaId = initialState.consultaId;
        }
    }
});

export default dialog.reducer;
export const { openConsultaDialog, closeConsultaDialog } = dialog.actions;
