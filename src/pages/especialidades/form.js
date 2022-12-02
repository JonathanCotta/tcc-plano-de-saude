import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Paper, Box, Divider, TextField, Grid, Button } from '@mui/material';

const formConfigByAction = {
    edit: {
        title: 'Editar',
        fieldsDisable: false,
        saveEnabled: true
    },
    add: {
        title: 'Nova',
        fieldsDisable: false,
        saveEnabled: true
    }
};

const EspecialidadeForm = (props) => {
    const { formAction } = props;

    const urlParams = useParams();
    const navigate = useNavigate();

    const formConfig = formConfigByAction[formAction];

    useEffect(() => {
        if (formAction !== 'add') {
            const { id } = urlParams;
        }
    });

    const handleGoBackClick = () => {
        navigate(-1);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Typography variant="h3">Especialidade</Typography>
                <Divider />
            </Grid>

            <Grid item xs={5} sx={{ mb: -2.25 }}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Typography variant="h5">{formConfig.title}</Typography>
                    <Box component="form" autoComplete="off" style={{ marginTop: 40 }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField id="name" label="Nome" variant="standard" disabled={formConfig.fieldsDisable} />
                            </Grid>

                            <Grid
                                xs={12}
                                container
                                item
                                style={{ marginTop: 70 }}
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                direction="row"
                                columnSpacing={1}
                            >
                                <Grid item>{formConfig.saveEnabled && <Button variant="contained">Salvar</Button>}</Grid>
                                <Grid item>
                                    <Button variant="contained" color="error">
                                        Remover
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" onClick={handleGoBackClick}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

EspecialidadeForm.propTypes = {
    formAction: PropTypes.string
};

export default EspecialidadeForm;
