import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Paper, Divider, Grid, styled, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const rows = [
    { id: 1, name: 'Hello' },
    { id: 2, name: 'DataGridPro' },
    { id: 3, name: 'MUI' }
];

const columns = [
    { field: 'id', headerName: 'Id', width: 200, sortable: false },
    { field: 'name', headerName: 'Nome', width: 400 }
];

// eslint-disable-next-line no-unused-vars
const EspecialidadeListStyle = styled('div')((_EspecialidadeList) => ({
    '.MuiDataGrid-columnHeaders': {
        backgroundColor: '#212121',
        color: '#fff',
        fontSize: 14
    },
    '.MuiDataGrid-virtualScroller': {
        backgroundColor: '#f2f2f2'
    }
}));

// eslint-disable-next-line no-unused-vars
const EspecialidadeList = (_props) => {
    const [selectedRow, setSelectedRow] = useState();

    const handleRowClick = (tableEvent) => {
        setSelectedRow(tableEvent.id);
    };

    return (
        <EspecialidadeListStyle>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography variant="h3">Especialidades</Typography>
                    <Divider />
                </Grid>

                <Grid item xs={8} sx={{ mb: -2.25 }}>
                    <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                        <Grid container rowSpacing={4}>
                            <Grid item xs={12}>
                                <Typography variant="h3">Especialidades</Typography>
                            </Grid>

                            <Grid container item xs={12} columnSpacing={1}>
                                <Grid item>
                                    <Button variant="outlined" size="small" component={Link} to="/especialidade/criar">
                                        Criar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        component={Link}
                                        to={`/especialidade/visualizar/${selectedRow}`}
                                    >
                                        Visualizar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                        component={Link}
                                        to={`/especialidade/editar/${selectedRow}`}
                                    >
                                        Editar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        component={Link}
                                        to={`/especialidade/remover/${selectedRow}`}
                                    >
                                        Remover
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{ height: 480, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={10}
                                    onRowClick={handleRowClick}
                                    components={{ Toolbar: GridToolbar }}
                                    disableColumnSelector
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
