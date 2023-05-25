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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import { openDialog } from 'store/reducers/dialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CONSTANTS from 'utils/CONSTANTS';

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

const AssociadoForm = (props) => {
    const theme = useTheme();
    const { formAction } = props;

    const dispatch = useDispatch();
    const urlParams = useParams();
    const navigate = useNavigate();

    const formConfig = formConfigByAction[formAction];

    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        if (formAction !== 'add') {
            const { id } = urlParams;
        }
    });

    const handleGoBackClick = () => {
        navigate(-1);
    };

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    const handleTipoSelectChange = () => {};

    const handleEspecialidadeSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        setEspecialidades(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleEstadoSelectChange = () => {};

    const handleCidadeSelectChange = () => {};

    const handleTipoLogradouroSelectChange = () => {};

    return (
        <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3">Associado</Typography>
                <Divider />
            </Grid>
            <Grid item xs={12} md={10}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box component="form" autoComplete="off">
                        <Grid container rowSpacing={4} columnSpacing={6}>
                            <Grid item xs={12} style={{ marginTop: 20 }}>
                                <Typography variant="h4">Informações gerais</Typography>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="name"
                                        label="Nome"
                                        type="text"
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
                                        label="Sobrenome"
                                        type="text"
                                        variant="standard"
                                        required
                                        disabled={formConfig.fieldsDisable}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="cpf"
                                        label="CPF"
                                        type="number"
                                        variant="standard"
                                        required
                                        disabled={formConfig.fieldsDisable}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DatePicker
                                    label="Data de Nascimento"
                                    format="DD-MM-YYYY"
                                    slotProps={{
                                        textField: {
                                            helperText: 'DD/MM/AAAA'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="estado-select-label">Formação</InputLabel>
                                    <Select
                                        labelId="estado-select-label"
                                        id="estado"
                                        onChange={handleEstadoSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
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
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="estado-select-label">Estado</InputLabel>
                                    <Select
                                        labelId="estado-select-label"
                                        id="estado"
                                        onChange={handleEstadoSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="cidade-select-label">Cidade</InputLabel>
                                    <Select
                                        labelId="cidade-select-label"
                                        id="cidade"
                                        onChange={handleCidadeSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="tipo-logradouro-select-label">
                                        Tipo Logradouro
                                    </InputLabel>
                                    <Select
                                        labelId="tipo-logradouro-select-label"
                                        id="tipologradouro"
                                        onChange={handleTipoLogradouroSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="logradouro"
                                        label="Logradouro"
                                        type="text"
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
                                        type="text"
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
                                        type="number"
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
                                        id="telefone1"
                                        label="Telefone 01"
                                        type="number"
                                        variant="standard"
                                        size="normal"
                                        required
                                        disabled={formConfig.fieldsDisable}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl>
                                    <TextField
                                        id="telefone2"
                                        label="Telefone 02"
                                        type="number"
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
                                    <InputLabel id="estado-select-label">Tipo do Plano</InputLabel>
                                    <Select
                                        labelId="estado-select-label"
                                        id="estado"
                                        onChange={handleEstadoSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="estado-select-label">Plano</InputLabel>
                                    <Select
                                        labelId="estado-select-label"
                                        id="estado"
                                        onChange={handleEstadoSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl variant="standard" fullWidth required>
                                    <InputLabel id="estado-select-label">
                                        Status do Plano
                                    </InputLabel>
                                    <Select
                                        labelId="estado-select-label"
                                        id="estado"
                                        onChange={handleEstadoSelectChange}
                                    >
                                        <MenuItem value={'enfermaria'}>Enfermaria</MenuItem>
                                        <MenuItem value={'quartoCompartilhado'}>
                                            Quarto compartilhado
                                        </MenuItem>
                                        <MenuItem value={'quartoIndividual'}>
                                            Quarto individual
                                        </MenuItem>
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
                                        <Button variant="contained">Salvar</Button>
                                    )}
                                </Grid>
                                {formConfig.removeEnabled && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="error"
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
