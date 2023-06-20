import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
    Paper,
    Divider,
    Grid,
    styled,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    IconButton,
    TextField,
    Autocomplete
} from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    ptBR
} from '@mui/x-data-grid';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { query, where, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { debounce } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import ConsultaDialog from 'components/ConsultaDialog';
import { openDialog } from 'store/reducers/consultaDialog';
import CONSTANTS from 'utils/CONSTANTS';
import { db } from 'firebaseApp';

const ScheduleButton = ({ rowId }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(
            openDialog({
                action: CONSTANTS.SCHEDULE_REGISTER_ACTION,
                message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE,
                consultaId: rowId
            })
        );
    };

    return (
        <IconButton color="success" onClick={handleClick}>
            <CheckCircleOutlined />
        </IconButton>
    );
};

ScheduleButton.propTypes = {
    rowId: PropTypes.string
};

const columns = [
    {
        field: 'action',
        sortable: false,
        headerName: 'Marcar',
        minWidth: 80,
        renderCell: (params) => <ScheduleButton rowId={params.id} />
    },
    { field: 'data', type: 'date', headerName: 'Data', minWidth: 150 },

    { field: 'bairro', headerName: 'Bairro', minWidth: 200 },
    { field: 'profissional', headerName: 'Profissional', minWidth: 250 }
];

const ConsultaScheduleStyle = styled('div')(() => ({
    '.MuiDataGrid-columnHeaders': {
        backgroundColor: '#4d4d4d',
        color: '#fff',
        fontSize: 14
    },
    '.MuiDataGrid-cell:focus': {
        outline: 'none'
    },
    '.MuiDataGrid-cell:selected': {
        outline: 'none'
    }
}));

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
                <Grid item xs={3}>
                    <GridToolbarFilterButton />
                </Grid>

                <Grid item xs={3}>
                    <GridToolbarQuickFilter />
                </Grid>
            </Grid>
        </GridToolbarContainer>
    );
}

const formikInitialValues = {
    especialidade: '',
    conveniado: '',
    profissional: '',
    dataConsulta: dayjs(),
    tempoConsulta: 30,
    horaConsulta: ''
};

const formikValidationSchema = Yup.object().shape({
    conveniado: Yup.object().required('Conveniado é obrigatário'),
    profissional: Yup.object().required('profissional é obrigatária'),
    especialidade: Yup.string().required('Especialidade é obrigatária'),
    tempoConsulta: Yup.number().required('Tempo de consulta é obrigatário'),
    horaConsulta: Yup.string().required('Hora de consulta é obrigatária'),
    dataConsulta: Yup.date().required('Data de consulta é obrigatária')
});

const ConsultasForm = () => {
    const dispatch = useDispatch();

    const [rows, setRows] = useState([]);
    const [conveniadoInputValue, setConveniadoInputValue] = useState('');
    const [conveniadoOptions, setConveniadoOptions] = useState([]);
    const [conveniadoLoading, setConveniadoLoading] = useState(false);
    const [profissionalInputValue, setProfissionalInputValue] = useState('');
    const [profissionalOptions, setProfissionalOptions] = useState([]);
    const [profissionalLoading, setProfissionalLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const tempoConsultaOptions = [15, 30, 60];

    const handleRowClick = ({ id }) => {
        dispatch(
            openDialog({
                message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE,
                action: CONSTANTS.SCHEDULE_REGISTER_ACTION,
                consultaId: id
            })
        );
    };

    const searchConveniados = useMemo(() => {
        return debounce(async () => {
            try {
                let conveniados = [];

                setConveniadoLoading(true);

                const conveniadosRef = collection(db, 'conveniados');
                const conveniadosQuery = query(
                    conveniadosRef,
                    where('nome', '>=', conveniadoInputValue),
                    where('nome', '<=', conveniadoInputValue + '\uf8ff')
                );
                const queryResult = await getDocs(conveniadosQuery);

                queryResult.forEach((doc) => {
                    conveniados.push(doc.dataConsulta());
                });

                setConveniadoOptions(conveniados);
                setConveniadoLoading(false);
            } catch (err) {
                console.error(err);
            }
        }, 300);
    }, [conveniadoInputValue]);

    const searchProfissionais = useMemo(() => {
        return debounce(async () => {
            try {
                let professionais = [];

                setProfissioanisLoading(true);

                const profissionaisRef = collection(db, 'users');
                const profissionaisQuery = query(
                    profissionaisRef,
                    where('identificacao', '>=', profissionalInputValue),
                    where('identificacao', '<=', profissionalInputValue + '\uf8ff')
                );
                const queryResult = await getDocs(profissionaisQuery);

                queryResult.forEach((doc) => {
                    professionais.push(doc.dataConsulta());
                });

                setProfissionalOptions(professionais);
                setProfissionalLoading(false);
            } catch (err) {
                console.error(err);
            }
        }, 300);
    }, [profissionalInputValue]);

    useEffect(() => {
        if (conveniadoInputValue !== '') {
            searchConveniados();
        }
    }, [conveniadoInputValue, searchConveniados]);

    useEffect(() => {
        if (profissionalInputValue !== '') {
            searchProfissionais();
        }
    }, [profissionalInputValue, searchProfissionais]);

    const handleInsertSubmit = (values, { setSubmitting }) => {
        setRows([...rows, values]);
        setSubmitting(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getEspecialidadeOptions = (profissional = {}) => {
        if (profissional && profissional.especialidades) {
            return profissional.especialidades.map((especialidade, index) => (
                <MenuItem key={`${especialidade}-${index}`} value={especialidade}>
                    {especialidade}
                </MenuItem>
            ));
        }
    };

    const getHoursString = (interval) => {
        let hours = [];

        for (let i = 0; i < 24; i++) {
            const hourString = i <= 9 ? `0${i}` : `${i}`;
            let timeString = `${hourString}:00`;

            hours.push(timeString);

            const intervalsCount = 60 / interval;

            if (interval > 1) {
                for (let j = 1; j < intervalsCount; j++) {
                    timeString = `${hourString}:${j * interval}`;
                    hours.push(timeString);
                }
            }
        }

        return hours;
    };

    const getHoursOptions = (interval) => {
        const hours = getHoursString(interval);

        return hours.map((hour, index) => (
            <MenuItem key={`${hour}-${index}`} value={hour}>
                {hour}
            </MenuItem>
        ));
    };

    const getTempoConsultaOptions = () => {
        return tempoConsultaOptions.map((interval, index) => (
            <MenuItem key={`${interval}-${index}`} value={interval}>
                {`${interval} minutos`}
            </MenuItem>
        ));
    };

    return (
        <ConsultaScheduleStyle>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">Abertura de Consultas</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Formik
                                    initialValues={formikInitialValues}
                                    validationSchema={formikValidationSchema}
                                    onSubmit={handleInsertSubmit}
                                >
                                    {({
                                        errors,
                                        handleChange,
                                        handleSubmit,
                                        isSubmitting,
                                        setFieldValue,
                                        values,
                                        touched,
                                        handleBlur
                                    }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <Grid
                                                container
                                                spacing={4}
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <Grid item xs={4} md={4}>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            loading={conveniadoLoading}
                                                            autoComplete
                                                            value={values.conveniado}
                                                            inputValue={conveniadoInputValue}
                                                            filterOptions={(x) => x}
                                                            options={conveniadoOptions}
                                                            getOptionLabel={(option) =>
                                                                option.nome || ''
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="standard"
                                                                    error={Boolean(
                                                                        touched.conveniado &&
                                                                            errors.conveniado
                                                                    )}
                                                                    helperText={
                                                                        touched.conveniado &&
                                                                        errors.conveniado
                                                                    }
                                                                    label="Conveniado"
                                                                    name="conveniado"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setFieldValue('conveniado', value);
                                                            }}
                                                            onInputChange={(event, value) => {
                                                                setConveniadoInputValue(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4} md={4}>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            loading={profissionalLoading}
                                                            autoComplete
                                                            value={values.profissional}
                                                            inputValue={profissionalInputValue}
                                                            filterOptions={(x) => x}
                                                            options={profissionalOptions}
                                                            getOptionLabel={(option) =>
                                                                option.nome || ''
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="standard"
                                                                    error={Boolean(
                                                                        touched.profissional &&
                                                                            errors.profissional
                                                                    )}
                                                                    helperText={
                                                                        touched.profissional &&
                                                                        errors.profissional
                                                                    }
                                                                    label="Identificação Profissional"
                                                                    name="profissional"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setFieldValue(
                                                                    'profissional',
                                                                    value
                                                                );
                                                            }}
                                                            onInputChange={(event, value) => {
                                                                setProfissionalInputValue(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={Boolean(
                                                            touched.especialidade &&
                                                                errors.especialidade
                                                        )}
                                                    >
                                                        <InputLabel id="especialidade-select-label">
                                                            Especialidade
                                                        </InputLabel>
                                                        <Select
                                                            labelId="especialidade-select-label"
                                                            id="especialidade"
                                                            name="especialidade"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.especialidade}
                                                        >
                                                            {getEspecialidadeOptions(
                                                                values.profissional
                                                            )}
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.especialidade &&
                                                            touched.especialidade
                                                                ? errors.especialidade
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <DatePicker
                                                        id="dataConsulta"
                                                        name="dataConsulta"
                                                        label="Data de Nascimento"
                                                        onBlur={handleBlur}
                                                        value={values.dataConsulta}
                                                        format="DD/MM/YYYY"
                                                        onChange={(value) => {
                                                            setFieldValue(
                                                                'dataConsulta',
                                                                dayjs(value)
                                                            );
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                variant: 'standard',
                                                                placeholder: 'DD/MM/YYYY',
                                                                helperText:
                                                                    errors.dataConsulta || ''
                                                            }
                                                        }}
                                                        error={Boolean(
                                                            touched.dataConsulta &&
                                                                errors.dataConsulta
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={Boolean(
                                                            touched.intervalo && errors.intervalo
                                                        )}
                                                    >
                                                        <InputLabel id="tempoConsulta-select-label">
                                                            Tempo de Consulta
                                                        </InputLabel>
                                                        <Select
                                                            labelId="tempoConsulta-select-label"
                                                            id="tempoConsulta"
                                                            name="tempoConsulta"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.tempoConsulta}
                                                        >
                                                            {getTempoConsultaOptions()}
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.tempoConsulta &&
                                                            touched.tempoConsulta
                                                                ? errors.tempoConsulta
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={Boolean(
                                                            touched.horaConsulta &&
                                                                errors.horaConsulta
                                                        )}
                                                    >
                                                        <InputLabel id="horaConsulta-select-label">
                                                            Hora de inicio
                                                        </InputLabel>
                                                        <Select
                                                            labelId="horaConsulta-select-label"
                                                            id="horaConsulta"
                                                            name="horaConsulta"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.horaConsulta}
                                                        >
                                                            {getHoursOptions(values.intervalo)}
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.horaConsulta &&
                                                            touched.horaConsulta
                                                                ? errors.horaConsulta
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6} />
                                                <Grid item xs={12} md={1}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        Inserir
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    <Button
                                                        variant="contained"
                                                        disabled={isSaving}
                                                        onClick={handleSave}
                                                    >
                                                        Salvar
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    )}
                                </Formik>
                            </Grid>
                            <Grid item xs={12} style={{ height: 480 }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={15}
                                    onRowDoubleClick={handleRowClick}
                                    components={{ Toolbar: CustomToolbar }}
                                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                                    disableColumnSelector
                                    style={{ with: '100%' }}
                                    componentsProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            quickFilterProps: { debounceMs: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <ConsultaDialog />
        </ConsultaScheduleStyle>
    );
};

export default ConsultasForm;
