import React, { useState } from 'react';
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
    IconButton
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
import { useDispatch } from 'react-redux';

import ConsultaDialog from 'components/ConsultaDialog';
import { openDialog } from 'store/reducers/consultaDialog';
import CONSTANTS from 'utils/CONSTANTS';

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
    rowId: PropTypes.number
};

const rowsMock = [
    {
        id: 1,
        data: '01/01/2021',
        conveniado: 'João',
        bairro: 'Bairro',
        bairro: 'Rua',
        profissional: '123'
    }
];

const columns = [
    {
        field: 'action',
        sortable: false,
        headerName: 'Marcar',
        minWidth: 80,
        renderCell: (params) => <ScheduleButton rowId={params.id} />
    },
    { field: 'data', type: 'date', headerName: 'Data', minWidth: 150 },
    { field: 'conveniado', headerName: 'Conveniado', minWidth: 250 },
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

const formikInitialValues = { estado: '', cidade: '', especialidade: '' };

const formikValidationSchema = Yup.object().shape({
    estado: Yup.string().required('Estado é obrigatário'),
    cidade: Yup.string().required('Cidade é obrigatária'),
    especialidade: Yup.string().required('Especialidade é obrigatária')
});

const ConsultaSchedule = () => {
    const dispatch = useDispatch();

    const [rows, setRows] = useState(rowsMock);

    const handleRowClick = ({ id }) => {
        dispatch(
            openDialog({
                message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE,
                action: CONSTANTS.SCHEDULE_REGISTER_ACTION,
                consultaId: id
            })
        );
    };

    const handleSearchSubmit = async (values, { setSubmitting }) => {};

    return (
        <ConsultaScheduleStyle>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">Agendamento de Consultas</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Formik
                                    initialValues={formikInitialValues}
                                    validationSchema={formikValidationSchema}
                                    onSubmit={handleSearchSubmit}
                                >
                                    {({
                                        errors,
                                        handleChange,
                                        handleSubmit,
                                        isSubmitting,
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
                                                <Grid item xs={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={touched.estado && errors.estado}
                                                    >
                                                        <InputLabel id="estado-select-label">
                                                            Estado
                                                        </InputLabel>
                                                        <Select
                                                            labelId="estado-select-label"
                                                            id="estado"
                                                            name="estado"
                                                            onChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            value={values.estado}
                                                        >
                                                            <MenuItem value={'RJ'}>RJ</MenuItem>
                                                        </Select>
                                                        <FormHelperText>
                                                            {touched.estado && errors.estado
                                                                ? errors.estado
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={touched.cidade && errors.cidade}
                                                    >
                                                        <InputLabel id="cidade-select-label">
                                                            Cidade
                                                        </InputLabel>
                                                        <Select
                                                            labelId="cidade-select-label"
                                                            id="cidade"
                                                            name="cidade"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.cidade}
                                                        >
                                                            <MenuItem value={'Rio de Janeiro'}>
                                                                Rio de Janeiro
                                                            </MenuItem>
                                                            <MenuItem value={'Niteroi'}>
                                                                Niteroi
                                                            </MenuItem>
                                                            <MenuItem value={'Caxias'}>
                                                                Caxias
                                                            </MenuItem>
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.cidade && touched.cidade
                                                                ? errors.cidade
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={
                                                            touched.especialidade &&
                                                            errors.especialidade
                                                        }
                                                    >
                                                        <InputLabel id="especialidade-select-label">
                                                            Especialidade
                                                        </InputLabel>
                                                        <Select
                                                            labelId="especialidade-select-label"
                                                            id="especialidade"
                                                            name="especialidade"
                                                            onChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            value={values.especialidade}
                                                        >
                                                            <MenuItem value={'enfermaria'}>
                                                                Otorrino
                                                            </MenuItem>
                                                            <MenuItem value={'quartoCompartilhado'}>
                                                                Pediatra
                                                            </MenuItem>
                                                            <MenuItem value={'quartoIndividual'}>
                                                                Clinico Geral
                                                            </MenuItem>
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.especialidade &&
                                                            touched.especialidade
                                                                ? errors.especialidade
                                                                : ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        disable={isSubmitting}
                                                    >
                                                        Buscar
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

export default ConsultaSchedule;
