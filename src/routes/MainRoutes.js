import React from 'react';
import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - especialidade
const EspecialidadeForm = Loadable(lazy(() => import('pages/especialidades/form')));
const EspecialidadesList = Loadable(lazy(() => import('pages/especialidades/list')));
// render - plano
const PlanoForm = Loadable(lazy(() => import('pages/planos/form')));
const PlanosList = Loadable(lazy(() => import('pages/planos/list')));
// render - conveniado
const ConveniadoForm = Loadable(lazy(() => import('pages/conveniados/form')));
const ConveniadosList = Loadable(lazy(() => import('pages/conveniados/list')));
// render - profissional
const ProfissionalForm = Loadable(lazy(() => import('pages/profissionais/form')));
const ProfissionaisList = Loadable(lazy(() => import('pages/profissionais/list')));
// render - associado
const AssociadoForm = Loadable(lazy(() => import('pages/associados/form')));
const AssociadosList = Loadable(lazy(() => import('pages/associados/list')));
// render - consulta
const ConsultaForm = Loadable(lazy(() => import('pages/consultas/form')));
const ConsultasList = Loadable(lazy(() => import('pages/consultas/list')));
const ConsultasSchedule = Loadable(lazy(() => import('pages/consultas/schedule')));

// ==============================|| MAIN ROUTING ||============================== //

const childrenRoutes = [
    {
        path: '/',
        element: <DashboardDefault />
    },
    {
        path: '/especialidades',
        element: <EspecialidadesList />,
        allowedUsers: ['admin']
    },
    {
        path: '/especialidade/criar',
        element: <EspecialidadeForm formAction="add" />,
        allowedUsers: ['admin']
    },
    {
        path: '/especialidade/editar/:id',
        element: <EspecialidadeForm formAction="edit" />,
        allowedUsers: ['admin']
    },
    {
        path: '/planos',
        element: <PlanosList />,
        allowedUsers: ['admin']
    },
    {
        path: '/plano/criar',
        element: <PlanoForm formAction="add" />,
        allowedUsers: ['admin']
    },
    {
        path: '/plano/editar/:id',
        element: <PlanoForm formAction="edit" />,
        allowedUsers: ['admin']
    },
    {
        path: '/conveniados',
        element: <ConveniadosList />,
        allowedUsers: ['admin']
    },
    {
        path: '/conveniado/criar',
        element: <ConveniadoForm formAction="add" />,
        allowedUsers: ['admin']
    },
    {
        path: '/conveniado/editar/:id',
        element: <ConveniadoForm formAction="edit" />,
        allowedUsers: ['admin']
    },
    {
        path: '/profissionais',
        element: <ProfissionaisList />,
        allowedUsers: ['admin']
    },
    {
        path: '/profissional/criar',
        element: <ProfissionalForm formAction="add" />,
        allowedUsers: ['admin']
    },
    {
        path: '/profissional/editar/:id',
        element: <ProfissionalForm formAction="edit" />,
        allowedUsers: ['admin']
    },
    {
        path: '/associados',
        element: <AssociadosList />,
        allowedUsers: ['admin', 'associado']
    },
    {
        path: '/associado/criar/:id',
        element: <AssociadoForm formAction="add" />,
        allowedUsers: ['admin', 'associado']
    },
    {
        path: '/associado/editar/:id',
        element: <AssociadoForm formAction="edit" />,
        allowedUsers: ['admin', 'associado']
    },
    {
        path: '/consultas',
        element: <ConsultasList />
    },
    {
        path: '/consultas/criar/:id',
        element: <ConsultaForm formAction="add" />,
        allowedUsers: ['admin', 'profissional']
    },
    {
        path: '/consultas/editar/:id',
        element: <ConsultaForm formAction="edit" />,
        allowedUsers: ['admin', 'profissional']
    },
    {
        path: '/consultas/agendar',
        element: <ConsultasSchedule />,
        allowedUsers: ['admin', 'associado']
    }
];

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: []
};

export const getMainRoutes = (user = {}) => {
    const { profile } = user;

    const filteredRoutesByUserType = childrenRoutes.filter((route) => {
        if (route.allowedUsers && route.allowedUsers.length > 0) {
            return route.allowedUsers.includes(profile.tipo);
        }

        return true;
    });

    const filteredMainRoutes = { ...MainRoutes, children: filteredRoutesByUserType };

    return filteredMainRoutes;
};

export default {
    MainRoutes,
    getMainRoutes
};
