import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { query, where, collection, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

import ConsultaDialog from 'components/ConsultaDialog';
import { openConsultaDialog } from 'store/reducers/consultaDialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { openDialog } from 'store/reducers/dialog';
import CONSTANTS from 'utils/CONSTANTS';
import { db } from 'firebaseApp';

const ScheduleButton = ({ rowId }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(
            openConsultaDialog({
                action: CONSTANTS.SCHEDULE_REGISTER_ACTION,
                message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE,
                consultaId: rowId
            })
        );
    };

    return (
        <IconButton color="success" onClick={handleClick} size="big">
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
        minWidth: 50,
        renderCell: (params) => <ScheduleButton rowId={params.id} />
    },
    {
        field: 'dataConsulta',
        type: 'date',
        headerName: 'Data',
        minWidth: 120,
        valueFormatter: (params) => {
            const convertedDate = params.value.toDate();

            return dayjs(convertedDate).format('DD/MM/YYYY');
        }
    },
    { field: 'horaConsulta', type: 'string', headerName: 'Hora', minWidth: 80 },
    { field: 'conveniado', headerName: 'Conveniado', minWidth: 200 },
    { field: 'bairro', headerName: 'Bairro', minWidth: 200 },
    { field: 'logradouro', headerName: 'Logradouro', minWidth: 180 }
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
    const user = useSelector((state) => state.user);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const { profile } = user;

        if ((profile.plano && profile.plano.qtdConsultas < 0) || !profile.plano.qtdConsultas) {
            dispatch(
                openDialog({
                    message: CONSTANTS.SOLD_OUT_FRANCHISE
                })
            );
        }
    }, [dispatch, user]);

    const handleRowClick = ({ id }) => {
        dispatch(
            openConsultaDialog({
                message: CONSTANTS.SCHEDULE_CONFIRM_MESSAGE,
                action: CONSTANTS.SCHEDULE_REGISTER_ACTION,
                consultaId: id
            })
        );
    };

    const handleSearchSubmit = async (values, { setSubmitting }) => {
        try {
            const { estado, cidade, especialidade } = values;
            const {
                profile: { plano }
            } = user;

            if (plano.qtdConsultas > 0) {
                setSubmitting(true);

                const consultasRef = collection(db, 'consultas');
                const consultasQuery = query(
                    consultasRef,
                    where('estado', '==', estado),
                    where('cidade', '==', cidade),
                    where('especialidade', '==', especialidade),
                    where('disponivel', '==', true),
                    where('planos', 'array-contains', { id: plano.id, nome: plano.nome })
                );

                onSnapshot(consultasQuery, (querySnapshot) => {
                    const docs = [];

                    querySnapshot.forEach((doc) => {
                        docs.push(doc.data());
                    });

                    setRows(docs);
                });
            } else {
                dispatch(
                    openDialog({
                        message: CONSTANTS.SOLD_OUT_FRANCHISE
                    })
                );
            }
        } catch (err) {
            console.error(err);
        }
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
                                                        error={Boolean(
                                                            touched.estado && errors.estado
                                                        )}
                                                    >
                                                        <InputLabel id="estado-select-label">
                                                            Estado
                                                        </InputLabel>
                                                        <Select
                                                            labelId="estado-select-label"
                                                            id="estado"
                                                            name="estado"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
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
                                                        error={Boolean(
                                                            touched.cidade && errors.cidade
                                                        )}
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
                                                            <MenuItem value={'Otorrino'}>
                                                                Otorrino
                                                            </MenuItem>
                                                            <MenuItem value={'Pediatra'}>
                                                                Pediatra
                                                            </MenuItem>
                                                            <MenuItem value={'Clínico Geral'}>
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
                                                        disabled={isSubmitting}
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
            <ConfirmationDialog />
        </ConsultaScheduleStyle>
    );
};

export default ConsultaSchedule;
