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

import { closeDialog } from '../store/reducers/consultaDialog';

export default function ConsultaDialog() {
    const { open, message, action, consultaId } = useSelector((state) => state.consultaDialog);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeDialog());
    };

    const handleConfirm = () => {
        console.log(action, consultaId);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography>Confirmação</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleConfirm}>
                    Sim
                </Button>
                <Button variant="outlined" color="error" onClick={handleClose}>
                    Não
                </Button>
            </DialogActions>
        </Dialog>
    );
}
