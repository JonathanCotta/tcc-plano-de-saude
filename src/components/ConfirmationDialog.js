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
                <Typography variant="subtitle1">Aviso</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography variant="body1" component="span">
                        {dialogState.message}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
