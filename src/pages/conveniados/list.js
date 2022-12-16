import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Paper, Divider, Grid, styled, Button } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter
} from '@mui/x-data-grid';

const rows = [
    { id: 1, name: 'Hello', classificacao: 'Individual' },
    { id: 2, name: 'DataGridPro', classificacao: 'Empresarial' },
    { id: 3, name: 'MUI', classificacao: 'Empresarial' }
];

const columns = [
    { field: 'id', headerName: 'Id', sortable: false, minWidth: 100 },
    { field: 'name', headerName: 'Nome', minWidth: 230 },
    { field: 'classificacao', headerName: 'Classificação', minWidth: 210 }
];

// eslint-disable-next-line no-unused-vars
const PlanoListStyle = styled('div')((_PlanoList) => ({
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
const PlanoList = (_props) => {
    const navigate = useNavigate();

    const handleRowClick = (tableEvent) => {
        return navigate(`/plano/editar/${tableEvent.id}`);
    };

    return (
        <PlanoListStyle>
            <Grid container rowSpacing={4} columnSpacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">Especialidades</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={6} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to="/especialidade/criar"
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
        </PlanoListStyle>
    );
};

export default PlanoList;
