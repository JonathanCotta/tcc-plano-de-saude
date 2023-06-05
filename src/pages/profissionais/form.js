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

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}

const ProfissionalForm = (props) => {
    const theme = useTheme();
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [userEmail, setUserEmail] = useState('');
    const formConfig = formConfigByAction[formAction];

    const [especialidades, setEspecialidades] = useState([]);
    const especialidadeOptions = ['Oncologia', 'Pediatria', 'Podologia'];
    useEffect(() => {
        if (user && user.uid !== urlParams.id) {
            setUserEmail(user.email);
        }
    }, [user, urlParams]);

    const handleGoBackClick = () => {
        navigate(-1);
    };

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    const handleEspecialidadeSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        setEspecialidades(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3">Profissional</Typography>
                <Divider />
            </Grid>
            <Grid item xs={12} md={10}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box>
                        <Formik
                            initialValues={{
                                nome: '',
                                sobrenome: '',
                                tipoIdentificacao: '',
                                identificacao: '',
                                tipoProfissional: '',
                                especialidades: [],
                                celular: '',
                                email: ''
                            }}
                            validationSchema={Yup.object().shape({
                                nome: Yup.string().required('Nome é obrigatário'),
                                sobrenome: Yup.string().required('Sobrenome é obrigatário'),
                                tipoIdentificacao: Yup.string().required(
                                    'Tipo de identificação é obrigatário'
                                ),
                                identificacao: Yup.string().required('Identificação é obrigatário'),
                                tipoProfissional: Yup.string().required(
                                    'Tipo de profissional é obrigatário'
                                ),
                                especialidades: Yup.array()
                                    .of(Yup.string())
                                    .min(1)
                                    .required('Especialidades é obrigatário'),
                                celular: Yup.number().required('Celular é obrigatário'),
                                email: Yup.string().required('E-mail é obrigatário')
                            })}
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                let profissionalId;

                                profissionalId = urlParams.id;

                                const profissionalDoc = {
                                    ...values,
                                    uid: profissionalId,
                                    isRegistryComplete: true
                                };

                                setDoc(doc(db, 'profissional', profissionalId), profissionalDoc)
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
                                <form onSubmit={handleSubmit} noValidate>
                                    <Grid container rowSpacing={4} columnSpacing={6}>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Informações gerais</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="nome"
                                                    label="Nome"
                                                    name="nome"
                                                    error={!!errors.nome}
                                                    helperText={errors.nome || ''}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.nome}
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="sobrenome"
                                                    name="sobrenome"
                                                    label="Sobrenome"
                                                    error={!!errors.sobrenome}
                                                    helperText={errors.sobrenome || ''}
                                                    type="text"
                                                    variant="standard"
                                                    value={values.sobrenome}
                                                    onChange={handleChange}
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}></Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="tipo-select-label">
                                                    Tipo de Identificação
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-select-label"
                                                    id="tipoIdentificacao"
                                                    name="tipoIdentificacao"
                                                    error={!!errors.tipoIdentificacao}
                                                    helperText={errors.tipoIdentificacao || ''}
                                                    value={values.tipoIdentificacao}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'CRM'}>CRM</MenuItem>
                                                    <MenuItem value={'UID'}>UID</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="identificacaoProfissional"
                                                    name="identificacaoProfissional"
                                                    label="Identificação Profissional"
                                                    type="text"
                                                    error={!!errors.identificacaoProfissional}
                                                    helperText={
                                                        errors.identificacaoProfissional || ''
                                                    }
                                                    value={values.identificacaoProfissional}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="tipo-profissional-select-label">
                                                    Tipo Profissional
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-profissional-select-label"
                                                    id="tipoProfissional"
                                                    name="tipoProfissional"
                                                    error={!!errors.tipoProfissional}
                                                    helperText={errors.tipoProfissional || ''}
                                                    value={values.tipoProfissional}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'Médico'}>Médico</MenuItem>
                                                    <MenuItem value={'Terapeuta'}>
                                                        Pediatra
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel
                                                    id="especialidades-select-label"
                                                    style={{ paddingTop: 0.4 }}
                                                >
                                                    Especialidades
                                                </InputLabel>
                                                <Select
                                                    labelId="especialidades-select-label"
                                                    id="especialidades"
                                                    name="especialidades"
                                                    error={!!errors.especialidades}
                                                    helperText={errors.especialidades || ''}
                                                    label="Especialidades"
                                                    multiple
                                                    onChange={handleEspecialidadeSelectChange}
                                                    value={especialidades}
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
                                                    {especialidadeOptions.map((name) => (
                                                        <MenuItem
                                                            key={name}
                                                            value={name}
                                                            style={getStyles(
                                                                name,
                                                                especialidades,
                                                                theme
                                                            )}
                                                        >
                                                            {name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Contato</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="celular"
                                                    label="Celular"
                                                    name="celular"
                                                    error={!!errors.celular}
                                                    helperText={errors.celular || ''}
                                                    type="number"
                                                    value={values.celular}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="email"
                                                    label="E-mail"
                                                    name="email"
                                                    error={!!errors.email}
                                                    helperText={errors.email || ''}
                                                    value={userEmail}
                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                    type="text"
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
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

ProfissionalForm.propTypes = {
    formAction: PropTypes.string
};

export default ProfissionalForm;
