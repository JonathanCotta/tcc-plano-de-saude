import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Paper, Box, Divider, TextField, Grid, Button } from '@mui/material';
import { useDispatch } from 'react-redux';

import { openDialog } from 'store/reducers/dialog';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CONSTANTS from 'utils/CONSTANTS';

const formConfigByAction = {
    edit: {
        fieldsDisable: false,
        saveEnabled: true,
        removeEnabled: true
    },
    add: {
        fieldsDisable: false,
        saveEnabled: true,
        removeEnabled: false
    }
};

const EspecialidadeForm = (props) => {
    const { formAction } = props;
    const dispatch = useDispatch();

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

    const handleRemoveClick = () => {
        dispatch(openDialog({ message: CONSTANTS.REMOVAL_CONFIRMATION_MESSAGE }));
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Typography variant="h3">Especialidade</Typography>
                <Divider />
            </Grid>
            <Grid item xs={6} sx={{ mb: -2.25 }}>
                <Paper elevation={1} style={{ padding: 20, paddingBottom: 20 }}>
                    <Box component="form" autoComplete="off">
                        <Grid container rowSpacing={4.5}>
                            <Grid item xs={12}>
                                <TextField
                                    id="name"
                                    label="Nome"
                                    variant="standard"
                                    disabled={formConfig.fieldsDisable}
                                />
                            </Grid>

                            <Grid
                                xs={12}
                                container
                                item
                                style={{ marginTop: 30 }}
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                direction="row"
                                columnSpacing={1}
                            >
                                <Grid item>
                                    {formConfig.saveEnabled && (
                                        <Button variant="contained">Salvar</Button>
                                    )}
                                </Grid>
                                {formConfig.removeEnabled && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleRemoveClick}
                                        >
                                            Remover
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleGoBackClick}
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
            <ConfirmationDialog />
        </Grid>
    );
};

EspecialidadeForm.propTypes = {
    formAction: PropTypes.string
};

export default EspecialidadeForm;
