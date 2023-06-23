import React from 'react';
import {
    Button,
    Dialog,
    Typography,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { closeDialog } from '../store/reducers/dialog';

export default function ConsultaDialog() {
    const dialogState = useSelector((state) => state.dialog);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeDialog());
    };

    return (
        <Dialog
            open={dialogState.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography>Alerta</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogState.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
