import React from 'react';
import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - especialidade
const EspecialidadeForm = Loadable(lazy(() => import('pages/especialidades/form')));
const EspecialidadeList = Loadable(lazy(() => import('pages/especialidades/list')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/especialidades',
            element: <EspecialidadeList />
        },
        {
            path: '/especialidade/criar',
            element: <EspecialidadeForm formAction="add" />
        },
        {
            path: '/especialidade/visualizar/:id',
            element: <EspecialidadeForm formAction="view" />
        },
        {
            path: '/especialidade/editar/:id',
            element: <EspecialidadeForm formAction="edit" />
        },
        {
            path: '/especialidade/remover/:id',
            element: <EspecialidadeForm formAction="remove" />
        }
    ]
};

export default MainRoutes;
