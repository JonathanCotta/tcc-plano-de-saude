import React, { useEffect, useState } from 'react';
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
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Yup from 'yup';

import { openDialog } from 'store/reducers/dialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CONSTANTS from 'utils/CONSTANTS';
import { auth, db } from 'firebaseApp';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

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

const atendimentos = ['Emergência', 'Ambulatório', 'Cirurgia', 'Exames', 'Clinico'];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}

const PlanoForm = (props) => {
    const theme = useTheme();
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();

    const formConfig = formConfigByAction[formAction];

    const [coberturaAtendimento, setCoberturaAtendimento] = useState([]);

    const handleGoBackClick = () => {
        navigate(-1);
    };

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    const handleCoberturaAtendimentoChange = (event) => {
        const {
            target: { value }
        } = event;
        setCoberturaAtendimento(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <Grid container rowSpacing={3}>
            <Grid item xs={12}>
                <Typography variant="h3">Plano</Typography>
                <Divider />
            </Grid>
            <Grid item xs={6} sx={{ mb: -2.25 }}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box>
                        <Formik
                            initialValues={{
                                nome: '',
                                classificacao: '',
                                qtdConsultas: 0,
                                examesAno: 0,
                                coberturaAtendimento: []
                            }}
                            validationSchema={Yup.object().shape({
                                nome: Yup.string().required('Nome é obrigatário'),
                                classificacao: Yup.string().required('Classificação é obrigatária'),
                                qtdConsultas: Yup.number().required(
                                    'Numero de consultas é obrigatário'
                                ),
                                examesAno: Yup.number().required('Numero de exames é obrigatário'),
                                coberturaAtendimento: Yup.array()
                                    .of(Yup.string())
                                    .min(1)
                                    .required('Cobertura de atendimento é obrigatário')
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                let planoId;

                                const { nome } = values;

                                if (formAction === 'add') {
                                    planoId = nome
                                        .trim()
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(' ', '_');
                                } else {
                                    planoId = urlParams.id;
                                }

                                const planoDoc = { ...values, id: planoId };

                                setDoc(doc(db, 'planos', planoId), planoDoc)
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
                            {({ errors, handleChange, handleSubmit, values }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container rowSpacing={4} columnSpacing={6}>
                                        <Grid item xs={5}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="nome"
                                                    label="Nome"
                                                    error={!!errors.nome}
                                                    helperText={errors.nome || ''}
                                                    onChange={handleChange}
                                                    type="text"
                                                    variant="standard"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="classificacao-select-label">
                                                    Classificação
                                                </InputLabel>
                                                <Select
                                                    labelId="classificacao-select-label"
                                                    id="classificacao"
                                                    label="Classificação"
                                                    error={!!errors.classificacao}
                                                    helperText={errors.classificacao || ''}
                                                    onChange={handleChange}
                                                    value={values.classificacao}
                                                >
                                                    <MenuItem value={'enfermaria'}>
                                                        Enfermaria
                                                    </MenuItem>
                                                    <MenuItem value={'quartoCompartilhado'}>
                                                        Quarto compartilhado
                                                    </MenuItem>
                                                    <MenuItem value={'quartoIndividual'}>
                                                        Quarto individual
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl>
                                                <TextField
                                                    id="qtdConsultas"
                                                    label="Numero de Consultas"
                                                    error={!!errors.qtdConsultas}
                                                    helperText={errors.qtdConsultas || ''}
                                                    type="number"
                                                    onChange={handleChange}
                                                    value={values.qtdConsultas}
                                                    variant="standard"
                                                    size="normal"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl variant="standard" required>
                                                <TextField
                                                    id="examesAno"
                                                    label="Exames por ano"
                                                    type="number"
                                                    value={values.examesAno}
                                                    error={!!errors.examesAno}
                                                    helperText={errors.examesAno || ''}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={9.5}>
                                            <FormControl fullWidth required>
                                                <InputLabel id="cobertura-atendimentos-select-label">
                                                    Atendimetnos cobertos
                                                </InputLabel>
                                                <Select
                                                    labelId="cobertura-atendimentos-select-label"
                                                    id="coberturaAtendimento"
                                                    label="Cobertura de Atentimentos"
                                                    error={!!errors.coberturaAtendimento}
                                                    helperText={errors.coberturaAtendimento || ''}
                                                    multiple
                                                    onChange={handleCoberturaAtendimentoChange}
                                                    value={coberturaAtendimento}
                                                    MenuProps={MenuProps}
                                                    input={
                                                        <OutlinedInput
                                                            id="select-multiple-chip"
                                                            label="Chip"
                                                        />
                                                    }
                                                    renderValue={(selected) => (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: 0.5
                                                            }}
                                                        >
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >
                                                    {atendimentos.map((name) => (
                                                        <MenuItem
                                                            key={name}
                                                            value={name}
                                                            style={getStyles(
                                                                name,
                                                                coberturaAtendimento,
                                                                theme
                                                            )}
                                                        >
                                                            {name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
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
                                                    <Button variant="contained" type="submit">
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

PlanoForm.propTypes = {
    formAction: PropTypes.string
};

export default PlanoForm;
