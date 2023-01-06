import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Grid, Typography } from '@mui/material';

// project imports
import MainCard from '../MainCard';

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = () => {
    const location = useLocation();
    const [splitedLocation, setSplitedLocation] = useState([]);

    const capitalized = (word = '') => word.charAt(0).toUpperCase() + word.slice(1);

    useEffect(() => {
        const locationArray = location.pathname.split('/').filter((i) => i !== '');
        setSplitedLocation(locationArray);
    }, [location]);

    // collapse item
    const mainContent = (
        <Typography
            component={Link}
            to={splitedLocation[1] ? `/${splitedLocation[0]}s` : `/${splitedLocation[0]}`}
            variant="h6"
            sx={{ textDecoration: 'none' }}
            color="textSecondary"
        >
            {capitalized(splitedLocation[0])}
        </Typography>
    );

    // items
    const itemContent = splitedLocation[1] && (
        <Typography variant="subtitle1" color="textPrimary">
            {capitalized(splitedLocation[1])}
        </Typography>
    );

    // main
    return (
        <MainCard border={false} sx={{ mb: 3, bgcolor: 'transparent' }} content={false}>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <Grid item>
                    <MuiBreadcrumbs aria-label="breadcrumb">
                        <Typography
                            component={Link}
                            to="/"
                            color="textSecondary"
                            variant="h6"
                            sx={{ textDecoration: 'none' }}
                        >
                            Home
                        </Typography>
                        {mainContent}
                        {itemContent}
                    </MuiBreadcrumbs>
                </Grid>
            </Grid>
        </MainCard>
    );

    return breadcrumbContent;
};

export default Breadcrumbs;
