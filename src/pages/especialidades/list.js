import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Paper, Divider, Grid, styled, Button } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';

const rows = [
    { id: 1, name: 'Hello' },
    { id: 2, name: 'DataGridPro' },
    { id: 3, name: 'MUI' }
];

const columns = [
    { field: 'id', headerName: 'Id', sortable: false, minWidth: 100 },
    { field: 'name', headerName: 'Nome', minWidth: 450 }
];

// eslint-disable-next-line no-unused-vars
const EspecialidadeListStyle = styled('div')((_EspecialidadeList) => ({
    '.MuiDataGrid-columnHeaders': {
        backgroundColor: '#212121',
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
const EspecialidadeList = (_props) => {
    const navigate = useNavigate();

    const handleRowClick = (tableEvent) => {
        return navigate(`/especialidade/editar/${tableEvent.id}`);
    };

    return (
        <EspecialidadeListStyle>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography variant="h3">Especialidades</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={6} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Button variant="outlined" size="small" component={Link} to="/especialidade/criar">
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
        </EspecialidadeListStyle>
    );
};

export default EspecialidadeList;
