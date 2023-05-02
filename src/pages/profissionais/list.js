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
        sobrenome: 'Call',
        tipoIdentificacao: 'CRM',
        identificacaoProfissional: '123'
    },
    {
        id: 2,
        nome: 'DataGridPro',
        sobrenome: 'Bill',
        tipoIdentificacao: 'CRM',
        identificacaoProfissional: '123'
    },
    {
        id: 3,
        nome: 'MUI',
        sobrenome: 'Mill',
        tipoIdentificacao: 'CRM',
        identificacaoProfissional: '123'
    }
];

const columns = [
    { field: 'id', headerName: 'Id', sortable: false, minWidth: 80 },
    { field: 'nome', headerName: 'Nome', minWidth: 250 },
    { field: 'sobrenome', headerName: 'Sobrenome', minWidth: 250 },
    { field: 'tipoIdentificacao', headerName: 'Tipo ID', minWidth: 80 },
    { field: 'identificacaoProfissional', headerName: 'Identificação', minWidth: 100 }
];

// eslint-disable-next-line no-unused-vars
const ProfissionalListStyle = styled('div')((_ProfissionalList) => ({
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
const ProfissionalList = (_props) => {
    const navigate = useNavigate();

    const handleRowClick = (tableEvent) => {
        return navigate(`/especialidade/editar/${tableEvent.id}`);
    };

    return (
        <ProfissionalListStyle>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <Typography variant="h3">Profissionais</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mb: -2.25 }}>
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
        </ProfissionalListStyle>
    );
};

export default ProfissionalList;
