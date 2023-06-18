// project import
import React from 'react';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from '@mui/x-date-pickers/locales';
import Auth from 'components/Auth';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <ThemeCustomization>
        <Auth>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
                <ScrollTop>
                    <Routes />
                </ScrollTop>
            </LocalizationProvider>
        </Auth>
    </ThemeCustomization>
);

export default App;
