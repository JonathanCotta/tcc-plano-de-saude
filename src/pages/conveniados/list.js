import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Paper, Divider, Grid, styled, Button } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    ptBR
} from '@mui/x-data-grid';

const rows = [
    {
        id: 1,
        nome: 'Hello',
        classificacao: 'Individual',
        tipo: 'clinica',
        estado: 'RJ',
        cidade: 'Rio de Janeiro'
    },
    {
        id: 2,
        nome: 'DataGridPro',
        classificacao: 'Empresarial',
        tipo: 'clinica',
        estado: 'RJ',
        cidade: 'Rio de Janeiro'
    },
    {
        id: 3,
        nome: 'MUI',
        classificacao: 'Empresarial',
        tipo: 'clinica',
        estado: 'RJ',
        cidade: 'Rio de Janeiro'
    }
];

const columns = [
    { field: 'id', headerName: 'Id', sortable: false, minWidth: 90 },
    { field: 'nome', headerName: 'Nome', minWidth: 300 },
    { field: 'tipo', headerName: 'Tipo', minWidth: 140 },
    { field: 'estado', headerName: 'Estado', minWidth: 100 },
    { field: 'cidade', headerName: 'Cidade', with: 210 }
];

// eslint-disable-next-line no-unused-vars
const ConveniadosListStyle = styled('div')((_ConveniadosList) => ({
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
            <Grid container>
                <Grid item xs={3}>
                    <GridToolbarFilterButton />
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={5}>
                    <GridToolbarQuickFilter />
                </Grid>
            </Grid>
        </GridToolbarContainer>
    );
}

// eslint-disable-next-line no-unused-vars
const ConveniadosList = (_props) => {
    const navigate = useNavigate();

    const handleRowClick = (tableEvent) => {
        return navigate(`/conveniado/editar/${tableEvent.id}`);
    };

    return (
        <ConveniadosListStyle>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">Conveniados</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={8} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to="/conveniado/criar"
                                >
                                    Criar
                                </Button>
                            </Grid>

                            <Grid item xs={12} style={{ height: 480 }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={10}
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
        </ConveniadosListStyle>
    );
};

export default ConveniadosList;
