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

const ConveniadoForm = (props) => {
    const theme = useTheme();
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const formConfig = formConfigByAction[formAction];

    const [userEmail, setUserEmail] = useState('');
    const [especialidades, setEspecialidades] = useState([]);
    const [planos, setPlanos] = useState([]);

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

    const handlePlanosSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        setPlanos(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <Grid container rowSpacing={3}>
            <Grid item xs={12}>
                <Typography variant="h3">Conveniado</Typography>
                <Divider />
            </Grid>
            <Grid item xs={12} md={10}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box>
                        <Formik
                            initialValues={{
                                nome: '',
                                cnpj: '',
                                tipo: '',
                                estado: '',
                                cidade: '',
                                tipoLogradouro: '',
                                logradouro: '',
                                numeroEndereco: '',
                                complemento: '',
                                bairro: '',
                                cep: '',
                                telefone1: '',
                                telefone2: '',
                                email: ''
                            }}
                            validationSchema={Yup.object().shape({
                                nome: Yup.string().required('Nome é obrigatário'),
                                cnpj: Yup.string().required('CNPJ é obrigatário'),
                                tipo: Yup.string().required('Tipo é obrigatário'),
                                estado: Yup.string().required('Estado é obrigatário'),
                                cidade: Yup.string().required('Cidade é obrigatária'),
                                tipoLogradouro: Yup.string().required(
                                    'Tipo de logradouro é obrigatário'
                                ),
                                logradouro: Yup.string().required('Logradouro é obrigatário'),
                                numeroEndereco: Yup.number().required(
                                    'NÚmero de endereço é obrigatário'
                                ),
                                complemento: Yup.string().required('Complemento é obrigatário'),
                                bairro: Yup.string().required('Bairro é obrigatário'),
                                cep: Yup.number().required('CEP é obrigatário'),
                                telefone1: Yup.number().required(
                                    'Ao menos um telefone é obrigatário'
                                ),
                                telefone2: Yup.number(),
                                email: Yup.string().required('E-mail é obrigatário'),
                                planos: Yup.array()
                                    .of(Yup.string())
                                    .min(1)
                                    .required('Planos são obrigatários'),
                                especialidades: Yup.array()
                                    .of(Yup.string())
                                    .min(1)
                                    .required('Especialidades são obrigatárias')
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                let conveniadoId;

                                const { nome } = values;

                                if (formAction === 'add') {
                                    conveniadoId = nome
                                        .trim()
                                        .toLowerCase()
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(' ', '_');
                                } else {
                                    conveniadoId = urlParams.id;
                                }

                                const conveniadoDoc = { ...values, id: conveniadoId };

                                setDoc(doc(db, 'conveniados', conveniadoId), conveniadoDoc)
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
                                                    id="cnpj"
                                                    name="cnpj"
                                                    label="CNPJ"
                                                    error={!!errors.cnpj}
                                                    helperText={errors.cnpj || '000.000.000-00'}
                                                    type="text"
                                                    variant="standard"
                                                    value={values.cnpj}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="tipo-select-label">Tipo</InputLabel>
                                                <Select
                                                    labelId="tipo-select-label"
                                                    id="tipo"
                                                    name="tipo"
                                                    error={!!errors.tipo}
                                                    helperText={errors.tipo || ''}
                                                    value={values.tipo}
                                                    onChange={handleChange}
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
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Endereço</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl nvariant="standard" fullWidth>
                                                <InputLabel id="estado-select-label">
                                                    Estado
                                                </InputLabel>
                                                <Select
                                                    name="estado"
                                                    value={values.estado}
                                                    error={!!errors.estado}
                                                    helperText={errors.estado || ''}
                                                    onChange={handleChange}
                                                    labelId="estado-select-label"
                                                    id="estado"
                                                >
                                                    <MenuItem value={'rj'}>RJ</MenuItem>
                                                    <MenuItem value={'sp'}>SP</MenuItem>
                                                    <MenuItem value={'mg'}>MG</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="cep"
                                                    label="cep"
                                                    name="cep"
                                                    type="number"
                                                    error={!!errors.cep}
                                                    helperText={errors.cep || ''}
                                                    value={values.cep}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="cidade-select-label">
                                                    Cidade
                                                </InputLabel>
                                                <Select
                                                    labelId="cidade-select-label"
                                                    id="cidade"
                                                    name="cidade"
                                                    error={!!errors.cidade}
                                                    helperText={errors.cidade || ''}
                                                    onChange={handleChange}
                                                    value={values.cidade}
                                                >
                                                    <MenuItem value={'niteroi'}>Niteroi</MenuItem>
                                                    <MenuItem value={'riodejaneiro'}>
                                                        Rio de Janeiro
                                                    </MenuItem>
                                                    <MenuItem value={'itaguai'}>Itaguai</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="bairro"
                                                    label="Bairro"
                                                    name="bairro"
                                                    error={!!errors.bairro}
                                                    helperText={errors.bairro || ''}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.bairro}
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="tipo-logradouro-select-label">
                                                    Tipo Logradouro
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-logradouro-select-label"
                                                    id="tipoLogradouro"
                                                    error={!!errors.tipoLogradouro}
                                                    helperText={errors.tipoLogradouro || ''}
                                                    name="tipoLogradouro"
                                                    value={values.tipoLogradouro}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'avenida'}>Avenida</MenuItem>
                                                    <MenuItem value={'rua'}>Rua</MenuItem>
                                                    <MenuItem value={'alameda'}>Alameda</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="logradouro"
                                                    label="Logradouro"
                                                    name="logradouro"
                                                    error={!!errors.logradouro}
                                                    helperText={errors.logradouro || ''}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.logradouro}
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="complemento"
                                                    label="Complemento"
                                                    name="complemento"
                                                    type="text"
                                                    error={!!errors.complemento}
                                                    helperText={errors.complemento || ''}
                                                    value={values.complemento}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="numeroEndereco"
                                                    label="Numero"
                                                    name="numeroEndereco"
                                                    type="number"
                                                    error={!!errors.numeroEndereco}
                                                    helperText={errors.numeroEndereco || ''}
                                                    value={values.numeroEndereco}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Contato</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="telefone1"
                                                    label="Telefone 01"
                                                    name="telefone1"
                                                    error={!!errors.telefone1}
                                                    helperText={errors.telefone1 || ''}
                                                    type="number"
                                                    value={values.telefone1}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="telefone2"
                                                    label="Telefone 02"
                                                    name="telefone2"
                                                    error={!!errors.telefone2}
                                                    helperText={errors.telefone2 || ''}
                                                    type="number"
                                                    value={values.telefone2}
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
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Atendimento</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel
                                                    id="planos-select-label"
                                                    style={{ paddingTop: 0.4 }}
                                                >
                                                    Planos
                                                </InputLabel>
                                                <Select
                                                    labelId="planos-select-label"
                                                    id="planos"
                                                    name="planos"
                                                    label="Planos"
                                                    error={!!errors.planos}
                                                    helperText={errors.planos || ''}
                                                    multiple
                                                    onChange={handlePlanosSelectChange}
                                                    value={planos}
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
                                                    {planos.map((name) => (
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
                                                    label="Especialidades"
                                                    error={!!errors.especialidades}
                                                    helperText={errors.especialidades || ''}
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
                                                    {especialidades.map((name) => (
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

ConveniadoForm.propTypes = {
    formAction: PropTypes.string
};

export default ConveniadoForm;
