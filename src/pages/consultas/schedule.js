import React, { useState } from 'react';
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
    FormHelperText
} from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    ptBR
} from '@mui/x-data-grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { openDialog } from 'store/reducers/dialog';
import CONSTANTS from 'utils/CONSTANTS';

const columns = [
    { field: 'action', sortable: false, headerName: 'Marcar', minWidth: 80 },
    { field: 'data', type: 'date', headerName: 'Data', minWidth: 150 },
    { field: 'conveniado', headerName: 'Conveniado', minWidth: 250 },
    { field: 'bairro', headerName: 'Bairro', minWidth: 200 },
    { field: 'profissional', headerName: 'Profissional', minWidth: 250 }
];

// eslint-disable-next-line no-unused-vars
const ConsultaScheduleStyle = styled('div')((_ConsultaList) => ({
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

// eslint-disable-next-line no-unused-vars
const ConsultaSchedule = (_props) => {
    const dispatch = useDispatch();

    const [rows, setRows] = useState([]);

    const handleRowClick = (tableEvent) => {
        dispatch(openDialog({ message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE }));
    };

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
                                    onSubmit={async (values, { setSubmitting }) => {}}
                                >
                                    {({ errors, handleChange, handleSubmit, values }) => (
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
                                                        error={!!errors.estado}
                                                    >
                                                        <InputLabel id="estado-select-label">
                                                            Estado
                                                        </InputLabel>
                                                        <Select
                                                            labelId="estado-select-label"
                                                            id="estado"
                                                            onChange={handleChange}
                                                            value={values.estado}
                                                        >
                                                            <MenuItem value={'enfermaria'}>
                                                                RJ
                                                            </MenuItem>
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.estado || ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={!!errors.cidade}
                                                    >
                                                        <InputLabel id="cidade-select-label">
                                                            Cidade
                                                        </InputLabel>
                                                        <Select
                                                            labelId="cidade-select-label"
                                                            id="cidade"
                                                            onChange={handleChange}
                                                            value={values.cidade}
                                                        >
                                                            <MenuItem value={'enfermaria'}>
                                                                Rio de Janeiro
                                                            </MenuItem>
                                                            <MenuItem value={'quartoCompartilhado'}>
                                                                Niteroi
                                                            </MenuItem>
                                                            <MenuItem value={'quartoIndividual'}>
                                                                Caxias
                                                            </MenuItem>
                                                        </Select>
                                                        <FormHelperText>
                                                            {errors.cidade || ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <FormControl
                                                        variant="standard"
                                                        fullWidth
                                                        error={!!errors.especialidade}
                                                    >
                                                        <InputLabel id="especialidade-select-label">
                                                            Especialidade
                                                        </InputLabel>
                                                        <Select
                                                            labelId="especialidade-select-label"
                                                            id="especialidade"
                                                            onChange={handleChange}
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
                                                            {errors.especialidade || ''}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button variant="contained" type="submit">
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
        </ConsultaScheduleStyle>
    );
};

export default ConsultaSchedule;
