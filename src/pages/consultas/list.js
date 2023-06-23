import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper, Divider, Grid, styled, IconButton } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    ptBR
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { CloseCircleFilled } from '@ant-design/icons';

import { db } from 'firebaseApp';
import { openConsultaDialog } from 'store/reducers/consultaDialog';
import ConsultaDialog from 'components/ConsultaDialog';
import CONSTANTS from 'utils/CONSTANTS';

const CancelButton = ({ rowId }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(
            openConsultaDialog({
                action: CONSTANTS.SCHEDULE_CANCEL_ACTION,
                message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE,
                consultaId: rowId
            })
        );
    };

    return (
        <IconButton color="error" onClick={handleClick} size="big">
            <CloseCircleFilled />
        </IconButton>
    );
};

CancelButton.propTypes = {
    rowId: PropTypes.string
};

const columns = [
    {
        field: 'action',
        sortable: false,
        headerName: 'Cancelar',
        minWidth: 40,
        renderCell: (params) => <CancelButton rowId={params.id} />
    },
    { field: 'dataConsulta', headerName: 'Data', sortable: true, minWidth: 110 },
    { field: 'horaConsulta', type: 'string', headerName: 'Hora', minWidth: 70 },
    { field: 'conveniado', headerName: 'Conveniado', minWidth: 190 },
    { field: 'bairro', headerName: 'Bairro', minWidth: 150 },
    { field: 'logradouro', headerName: 'Logradouro', minWidth: 170 },
    { field: 'numeroEndereco', headerName: 'Nº', minWidth: 50 }
];

// eslint-disable-next-line no-unused-vars
const ConsultaListStyle = styled('div')((_ConsultaList) => ({
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

// eslint-disable-next-line no-unused-vars
const ConsultaList = (_props) => {
    const { profile } = useSelector((state) => state.user);
    const [rows, setRows] = useState([]);
    const dispatch = useDispatch();

    const getUserConsultas = useCallback(async () => {
        try {
            const { uid } = profile;

            const consultasRef = collection(db, 'consultas');
            const consultasQuery = query(consultasRef, where('associado.uid', '==', uid));

            return onSnapshot(consultasQuery, (querySnapshot) => {
                const consultaDocs = [];
                querySnapshot.forEach((doc) => {
                    consultaDocs.push(doc.data());
                });
                setRows(consultaDocs);
            });
        } catch (err) {
            console.err(err);
        }
    }, [profile]);

    useEffect(() => {
        let unsubscribe;

        if (profile.uid) {
            unsubscribe = getUserConsultas();
        }

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [getUserConsultas, profile]);

    const handleRowDoubleClick = ({ id }) => {
        dispatch(
            openConsultaDialog({
                action: CONSTANTS.SCHEDULE_CANCEL_ACTION,
                message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE,
                consultaId: id
            })
        );
    };

    return (
        <ConsultaListStyle>
            <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h3">Consultas</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid container item></Grid>
                            <Grid item xs={12} style={{ height: 480 }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={20}
                                    onRowDoubleClick={handleRowDoubleClick}
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
        </ConsultaListStyle>
    );
};

export default ConsultaList;
