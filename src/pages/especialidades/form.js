import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Typography,
    Paper,
    Box,
    Divider,
    TextField,
    Grid,
    Button,
    FormControl,
    FormHelperText
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from 'firebaseApp';
import { openDialog } from 'store/reducers/dialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CONSTANTS from 'utils/CONSTANTS';

const formConfigByAction = {
    edit: {
        fieldsDisable: false,
        saveEnabled: true,
        removeEnabled: true
    },
    add: {
        fieldsDisable: false,
        saveEnabled: true,
        removeEnabled: false
    }
};

const EspecialidadeForm = (props) => {
    const { formAction } = props;
    const dispatch = useDispatch();

    const urlParams = useParams();
    const navigate = useNavigate();

    const formConfig = formConfigByAction[formAction];

    const handleGoBackClick = () => {
        navigate(-1);
    };

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    return (
        <Grid container rowSpacing={3}>
            <Grid item xs={12}>
                <Typography variant="h3">Especialidade</Typography>
                <Divider />
            </Grid>
            <Grid item xs={6} sx={{ mb: -2.25 }}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box>
                        <Formik
                            initialValues={{
                                nome: ''
                            }}
                            validationSchema={Yup.object().shape({
                                nome: Yup.string().max(255).required('Campo obrigatário')
                            })}
                            onSubmit={async (values, { setSubmitting, setErrors, setStatus }) => {
                                const { nome } = values;
                                let especialidadeID;

                                if (formAction === 'add') {
                                    especialidadeID = nome
                                        .trim()
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(' ', '_');
                                } else {
                                    especialidadeID = urlParams.id;
                                }

                                const especialidadeDoc = { nome };

                                setDoc(doc(db, 'especialidades', especialidadeID), especialidadeDoc)
                                    .then(() => {
                                        setStatus({ success: true });
                                        setSubmitting(true);
                                        navigate('/');
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        setStatus({ success: false });
                                        setErrors({ submit: err.message });
                                        setSubmitting(false);
                                    });
                            }}
                        >
                            {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container rowSpacing={4}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="nome"
                                                    label="Nome"
                                                    error={!!errors.nome}
                                                    variant="standard"
                                                    onChange={handleChange}
                                                    value={values.nome}
                                                    disabled={formConfig.fieldsDisable}
                                                    helperText={errors.nome || ''}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {errors.submit && (
                                            <Grid item xs={12}>
                                                <FormHelperText error>
                                                    {errors.submit}
                                                </FormHelperText>
                                            </Grid>
                                        )}
                                        <Grid
                                            xs={12}
                                            container
                                            item
                                            style={{ marginTop: 30 }}
                                            alignItems="flex-end"
                                            justifyContent="flex-end"
                                            direction="row"
                                            columnSpacing={1}
                                        >
                                            <Grid item>
                                                {formConfig.saveEnabled && (
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        Salvar
                                                    </Button>
                                                )}
                                            </Grid>
                                            {formConfig.removeEnabled && (
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        type="submit"
                                                        onClick={handleRemoveClick}
                                                        disabled={isSubmitting}
                                                    >
                                                        Remover
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleGoBackClick}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancelar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Paper>
            </Grid>
            <ConfirmationDialog />
        </Grid>
    );
};

EspecialidadeForm.propTypes = {
    formAction: PropTypes.string
};

export default EspecialidadeForm;
