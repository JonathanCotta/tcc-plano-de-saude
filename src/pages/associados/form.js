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
    MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Yup from 'yup';

import { openDialog } from 'store/reducers/dialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CONSTANTS from 'utils/CONSTANTS';
import { auth, db } from 'firebaseApp';

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

const AssociadoForm = (props) => {
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [userEmail, setUserEmail] = useState('');

    const formConfig = formConfigByAction[formAction];

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
        }
    }, [user]);

    const handleGoBackClick = () => {
        navigate(-1);
    };

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3">Associado</Typography>
                <Divider />
            </Grid>
            <Grid item xs={12} md={10}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box>
                        <Formik
                            initialValues={{
                                nome: '',
                                sobrenome: '',
                                cpf: '',
                                dataNascimento: 0,
                                escolaridade: '',
                                estado: '',
                                cidade: '',
                                tipoLogradouro: '',
                                logradouro: '',
                                numeroEndereco: '',
                                complemento: '',
                                bairro: '',
                                cep: '',
                                celular: '',
                                email: '',
                                tipoPlano: '',
                                plano: '',
                                statusPlano: 'ativo'
                            }}
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                const { email } = user;
                                const userDoc = {
                                    ...values,
                                    uid: urlParams,
                                    email,
                                    tipo: 'associado',
                                    isRegistryComplete: true
                                };

                                setDoc(doc(db, 'users', urlParams), userDoc)
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
                            {({
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                setFieldValue,
                                values
                            }) => (
                                <form noValidate onSubmit={handleSubmit}>
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
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.nome}
                                                    variant="standard"
                                                    required
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
                                                    type="text"
                                                    variant="standard"
                                                    value={values.sobrenome}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="cpf"
                                                    name="cpf"
                                                    label="CPF"
                                                    type="number"
                                                    variant="standard"
                                                    value={values.cpf}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <DatePicker
                                                id="dataNascimento"
                                                label="Data de Nascimento"
                                                format="DD-MM-YYYY"
                                                onChange={(value) => {
                                                    setFieldValue(
                                                        'dataNascimento',
                                                        Date.parse(value)
                                                    );
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        helperText: 'DD/MM/AAAA'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="escolaridade-select-label">
                                                    Formação
                                                </InputLabel>
                                                <Select
                                                    labelId="escolaridade-select-label"
                                                    id="escolaridade"
                                                    name="escolaridade"
                                                    value={values.escolaridade}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'segundograu'}>
                                                        2º Grau
                                                    </MenuItem>
                                                    <MenuItem value={'terceirograu'}>
                                                        Ensino superior
                                                    </MenuItem>
                                                    <MenuItem value={'fundamental'}>
                                                        Primário
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Endereço</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl nvariant="standard" fullWidth required>
                                                <InputLabel id="estado-select-label">
                                                    Estado
                                                </InputLabel>
                                                <Select
                                                    name="estado"
                                                    value={values.estado}
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
                                                    value={values.cep}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="cidade-select-label">
                                                    Cidade
                                                </InputLabel>
                                                <Select
                                                    labelId="cidade-select-label"
                                                    id="cidade"
                                                    name="cidade"
                                                    onChange={handleChange}
                                                    value={values.cidade}
                                                    required
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
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.bairro}
                                                    variant="standard"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="tipo-logradouro-select-label">
                                                    Tipo Logradouro
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-logradouro-select-label"
                                                    id="tipoLogradouro"
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
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.logradouro}
                                                    variant="standard"
                                                    required
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
                                                    value={values.complemento}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    required
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
                                                    value={values.numeroEndereco}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    required
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
                                                    id="celular"
                                                    label="Celular"
                                                    name="celular"
                                                    type="number"
                                                    value={values.telefone1}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    size="normal"
                                                    required
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
                                                    value={userEmail}
                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                    type="text"
                                                    variant="standard"
                                                    required
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Plano</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="tipo-plano-select-label">
                                                    Tipo do Plano
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-plano-select-label"
                                                    id="tipoPlano"
                                                    name="tipoPlano"
                                                    value={values.tipoPlano}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'individual'}>
                                                        Individual
                                                    </MenuItem>
                                                    <MenuItem value={'empresa'}>Empresa</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="plano-select-label">
                                                    Plano
                                                </InputLabel>
                                                <Select
                                                    labelId="plano-select-label"
                                                    id="plano"
                                                    name="plano"
                                                    value={values.plano}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'blue'}>Blue</MenuItem>
                                                    <MenuItem value={'green'}>Green</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth required>
                                                <InputLabel id="status-plano-select-label">
                                                    Status do Plano
                                                </InputLabel>
                                                <Select
                                                    labelId="status-plano-select-label"
                                                    id="statusPlano"
                                                    name="statusPlano"
                                                    value={values.statusPlano}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={'ativo'}>Ativo</MenuItem>
                                                    <MenuItem value={'analise'}>Análise</MenuItem>
                                                    <MenuItem value={'inativo'}>Inativo</MenuItem>
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

AssociadoForm.propTypes = {
    formAction: PropTypes.string
};

export default AssociadoForm;
