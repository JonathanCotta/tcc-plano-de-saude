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
import { doc, updateDoc } from 'firebase/firestore';

import { closeConsultaDialog } from '../store/reducers/consultaDialog';
import CONSTANTS from 'utils/CONSTANTS';
import { db } from 'firebaseApp';
import { setUser } from 'store/reducers/user';

export default function ConsultaDialog() {
    const { open, message, action, consultaId } = useSelector((state) => state.consultaDialog);
    const { profile } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const consultaUpdate = async (id, fields = {}) => {
        try {
            const docRef = doc(db, 'consultas', id);

            await updateDoc(docRef, fields);

            console.log('Document successfully updated!');
        } catch (err) {
            console.log(err);
        }
    };

    const associadoUpdate = async (id, fields = {}) => {
        try {
            const docRef = doc(db, 'users', id);

            await updateDoc(docRef, fields);

            dispatch(setUser(fields));

            console.log('Document successfully updated!');
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = () => {
        dispatch(closeConsultaDialog());
    };

    const handleConfirm = async () => {
        let consultaFields = {};
        const newProfile = { ...profile };

        if (action === CONSTANTS.SCHEDULE_REGISTER_ACTION) {
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

            newProfile.plano.qtdConsultas = newProfile.plano.qtdConsultas - 1;
        }

        if (action === CONSTANTS.SCHEDULE_CANCEL_ACTION) {
            consultaFields = { disponivel: true, associado: {} };

            newProfile.plano.qtdConsultas = newProfile.plano.qtdConsultas + 1;
        }

        await consultaUpdate(consultaId, consultaFields);
        await associadoUpdate(newProfile.uid, newProfile);

        dispatch(closeDialog());
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
