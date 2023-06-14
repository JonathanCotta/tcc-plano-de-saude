import React, { useEffect, useState } from 'react';
import { Typography, Paper, Divider, Grid, styled, IconButton } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    ptBR
} from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { CloseCircleFilled } from '@ant-design/icons';

import { openDialog } from 'store/reducers/consultaDialog';
import ConsultaDialog from 'components/ConsultaDialog';
import CONSTANTS from 'utils/CONSTANTS';

const rowsMock = [
    {
        id: 1,
        data: '01/01/2021',
        conveniado: 'João',
        bairro: 'Bairro',
        logradouro: 'Rua',
        numeroEndereco: '123'
    }
];

const CancelButton = ({ rowId }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(
            openDialog({
                action: CONSTANTS.SCHEDULE_CANCEL_ACTION,
                message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE,
                consultaId: rowId
            })
        );
    };

    return (
        <IconButton color="error" onClick={handleClick}>
            <CloseCircleFilled />
        </IconButton>
    );
};

const columns = [
    {
        field: 'action',
        sortable: false,
        headerName: 'Cancelar',
        minWidth: 80,
        renderCell: (params) => <CancelButton rowId={params.id} />
    },
    { field: 'data', headerName: 'Data', sortable: true, minWidth: 120 },
    { field: 'conveniado', headerName: 'Conveniado', minWidth: 200 },
    { field: 'bairro', headerName: 'Bairro', minWidth: 200 },
    { field: 'logradouro', headerName: 'Logradouro', minWidth: 200 },
    { field: 'numeroEndereco', headerName: 'Nº', minWidth: 80 }
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
    const [rows, setRows] = useState(rowsMock);

    const dispatch = useDispatch();

    useEffect(() => {}, []);

    const handleRowDoubleClick = ({ id }) => {
        dispatch(
            openDialog({
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
