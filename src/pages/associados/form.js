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
    FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as Yup from 'yup';
import { SearchOutlined } from '@ant-design/icons';

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

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

const AssociadoForm = (props) => {
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [userEmail, setUserEmail] = useState('');

    const formConfig = formConfigByAction[formAction];

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

    return (
        <Grid container rowSpacing={3}>
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
                                codigoCliente: '',
                                plano: '',
                                statusPlano: 'ativo'
                            }}
                            validationSchema={Yup.object().shape({
                                nome: Yup.string().required('Nome é obrigatário'),
                                sobrenome: Yup.string().required('Sobrenome é obrigatário'),
                                cpf: Yup.string()
                                    .required('CPF é obrigatário')
                                    .matches(cpfRegex, 'CPF inválido'),
                                dataNascimento: Yup.date().required(
                                    'Data de nascimento é obrigatária'
                                ),
                                escolaridade: Yup.string().required('Escolaridade é obrigatária'),
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
                                celular: Yup.number().required('Celular é obrigatário'),
                                email: Yup.string().required('E-mail é obrigatário'),
                                tipoPlano: Yup.string().required('Tipo de plano é obrigatário'),
                                plano: Yup.string().required('Plano é obrigatário'),
                                codigoCliente: Yup.string().required(
                                    'Numero da carteira é obrigatário'
                                ),
                                statusPlano: Yup.string().required('Status do plano é obrigatário')
                            })}
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
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,
                                values,
                                touched
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
                                                    error={touched.nome && errors.nome}
                                                    helperText={errors.nome || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={touched.sobrenome && errors.sobrenome}
                                                    helperText={errors.sobrenome || ''}
                                                    onBlur={handleBlur}
                                                    type="text"
                                                    variant="standard"
                                                    value={values.sobrenome}
                                                    onChange={handleChange}
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
                                                    error={touched.cpf && errors.cpf}
                                                    helperText={errors.cpf || '000.000.000-00'}
                                                    type="text"
                                                    onBlur={handleBlur}
                                                    variant="standard"
                                                    value={values.cpf}
                                                    onChange={handleChange}
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <DatePicker
                                                id="dataNascimento"
                                                label="Data de Nascimento"
                                                onBlur={handleBlur}
                                                error={
                                                    touched.dataNascimento && errors.dataNascimento
                                                }
                                                format="DD-MM-YYYY"
                                                onChange={(value) => {
                                                    setFieldValue(
                                                        'dataNascimento',
                                                        Date.parse(value)
                                                    );
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        helperText:
                                                            errors.dataNascimento || 'DD/MM/AAAA'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="escolaridade-select-label">
                                                    Formação
                                                </InputLabel>
                                                <Select
                                                    labelId="escolaridade-select-label"
                                                    id="escolaridade"
                                                    name="escolaridade"
                                                    error={
                                                        touched.escolaridade && errors.escolaridade
                                                    }
                                                    value={values.escolaridade}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                <FormHelperText>
                                                    {errors.escolaridade && touched.escolaridade
                                                        ? errors.escolaridade
                                                        : ''}
                                                </FormHelperText>
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
                                                    error={touched.estado && errors.estado}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    labelId="estado-select-label"
                                                    id="estado"
                                                >
                                                    <MenuItem value={'rj'}>RJ</MenuItem>
                                                    <MenuItem value={'sp'}>SP</MenuItem>
                                                    <MenuItem value={'mg'}>MG</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {errors.estado && touched.estado
                                                        ? errors.estado
                                                        : ''}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="cep"
                                                    label="cep"
                                                    name="cep"
                                                    type="number"
                                                    error={touched.cep && errors.cep}
                                                    helperText={errors.cep || ''}
                                                    value={values.cep}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={touched.cidade && errors.cidade}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={touched.bairro && errors.bairro}
                                                    helperText={errors.bairro || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={
                                                        touched.tipoLogradouro &&
                                                        errors.tipoLogradouro
                                                    }
                                                    name="tipoLogradouro"
                                                    value={values.tipoLogradouro}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <MenuItem value={'avenida'}>Avenida</MenuItem>
                                                    <MenuItem value={'rua'}>Rua</MenuItem>
                                                    <MenuItem value={'alameda'}>Alameda</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {errors.tipoLogradouro && touched.tipoLogradouro
                                                        ? errors.tipoLogradouro
                                                        : ''}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    id="logradouro"
                                                    label="Logradouro"
                                                    name="logradouro"
                                                    error={touched.logradouro && errors.logradouro}
                                                    helperText={errors.logradouro || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={
                                                        touched.complemento && errors.complemento
                                                    }
                                                    helperText={errors.complemento || ''}
                                                    value={values.complemento}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={
                                                        touched.numeroEndereco &&
                                                        errors.numeroEndereco
                                                    }
                                                    helperText={errors.numeroEndereco || ''}
                                                    value={values.numeroEndereco}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    id="celular"
                                                    label="Celular"
                                                    name="celular"
                                                    error={touched.celular && errors.celular}
                                                    helperText={errors.celular || ''}
                                                    type="number"
                                                    value={values.celular}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                    error={touched.email && errors.email}
                                                    helperText={errors.email || ''}
                                                    value={userEmail}
                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                    onBlur={handleBlur}
                                                    type="text"
                                                    variant="standard"
                                                    disabled={formConfig.fieldsDisable}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: 20 }}>
                                            <Typography variant="h4">Plano</Typography>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="tipo-plano-select-label">
                                                    Tipo do Plano
                                                </InputLabel>
                                                <Select
                                                    labelId="tipo-plano-select-label"
                                                    id="tipoPlano"
                                                    name="tipoPlano"
                                                    error={touched.tipoPlano && errors.tipoPlano}
                                                    value={values.tipoPlano}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <MenuItem value={'individual'}>
                                                        Individual
                                                    </MenuItem>
                                                    <MenuItem value={'empresa'}>Empresa</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {errors.tipoPlano && touched.tipoPlano
                                                        ? errors.tipoPlano
                                                        : ''}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel id="plano-select-label">
                                                    Plano
                                                </InputLabel>
                                                <Select
                                                    labelId="plano-select-label"
                                                    id="plano"
                                                    name="plano"
                                                    error={touched.plano && errors.plano}
                                                    value={values.plano}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <MenuItem value={'blue'}>Blue</MenuItem>
                                                    <MenuItem value={'green'}>Green</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {errors.plano && touched.plano
                                                        ? errors.plano
                                                        : ''}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControl>
                                                <TextField
                                                    id="codigoCliente"
                                                    label="Número da carteira"
                                                    name="codigoCliente"
                                                    error={
                                                        touched.codigoCliente &&
                                                        errors.codigoCliente
                                                    }
                                                    helperText={errors.codigoCliente || ''}
                                                    type="number"
                                                    value={values.codigoCliente}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    variant="standard"
                                                    size="normal"
                                                    disabled={formConfig.fieldsDisable}
                                                />
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
                                                    error={
                                                        touched.statusPlano && errors.statusPlano
                                                    }
                                                    value={values.statusPlano}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <MenuItem value={'ativo'}>Ativo</MenuItem>
                                                    <MenuItem value={'analise'}>Análise</MenuItem>
                                                    <MenuItem value={'inativo'}>Inativo</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {errors.statusPlano && touched.statusPlano
                                                        ? errors.statusPlano
                                                        : ''}
                                                </FormHelperText>
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
