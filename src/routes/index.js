import React from 'react';
import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import { getMainRoutes } from './MainRoutes';
import { useSelector } from 'react-redux';

// ==============================|| ROUTING RENDER ||============================== //

export const ThemeRoutes = () => {
    const userData = useSelector((state) => state.user);

    const MainRoutes = getMainRoutes(userData);

    const routesElement = useRoutes([MainRoutes, LoginRoutes]);

    return routesElement;
};

export default ThemeRoutes;
