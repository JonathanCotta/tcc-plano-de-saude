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
import { doc, updatedDoc } from 'firebase/firestore';

import { closeDialog } from '../store/reducers/consultaDialog';
import { SCHEDULE_REGISTER_ACTION, SCHEDULE_CANCEL_ACTION } from 'utils/CONSTANTS';

export default function ConsultaDialog() {
    const { open, message, action, consultaId } = useSelector((state) => state.consultaDialog);
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const consultaUpdate = async (id, fields = {}) => {
        try {
            const docRef = doc(db, 'consultas', id);

            await updatedDoc(docRef, fields);

            console.log('Document successfully updated!');
        } catch (err) {
            console.log(err);
        } finally {
            dispatch(closeDialog());
        }
    };

    const handleClose = () => {
        dispatch(closeDialog());
    };

    const handleConfirm = async () => {
        let consultaFields = {};

        if (action === SCHEDULE_REGISTER_ACTION) {
            const { nome, sobrenome, celular, email, cpf, plano, uid, codigoCliente } = profile;
            const associado = {
                nome,
                sobrenome,
                celular,
                email,
                cpf,
                plano,
                uid,
                codigoCliente
            };

            consultaFields = {
                disponivel: false,
                associado
            };

            await consultaUpdate(consultaId, consultaFields);
        }

        if (action === SCHEDULE_CANCEL_ACTION) {
            consultaFields = {
                disponivel: false,
                associado: {}
            };

            await consultaUpdate(consultaId, consultaFields);
        }
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
