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
const PlanoForm = Loadable(lazy(() => import('pages/planos/form')));
const PlanosList = Loadable(lazy(() => import('pages/planos/list')));
const ConveniadoForm = Loadable(lazy(() => import('pages/conveniados/form')));
const ConveniadosList = Loadable(lazy(() => import('pages/conveniados/list')));
const ProfissionalForm = Loadable(lazy(() => import('pages/profissionais/form')));
const ProfissionaisList = Loadable(lazy(() => import('pages/profissionais/list')));
const AssociadoForm = Loadable(lazy(() => import('pages/associados/form')));
const AssociadosList = Loadable(lazy(() => import('pages/associados/list')));

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
            element: <EspecialidadesList />
        },
        {
            path: '/especialidade/criar',
            element: <EspecialidadeForm formAction="add" />
        },
        {
            path: '/especialidade/editar/:id',
            element: <EspecialidadeForm formAction="edit" />
        },
        {
            path: '/planos',
            element: <PlanosList />
        },
        {
            path: '/plano/criar',
            element: <PlanoForm formAction="add" />
        },
        {
            path: '/plano/editar/:id',
            element: <PlanoForm formAction="edit" />
        },
        {
            path: '/conveniados',
            element: <ConveniadosList />
        },
        {
            path: '/conveniado/criar',
            element: <ConveniadoForm formAction="add" />
        },
        {
            path: '/conveniado/editar/:id',
            element: <ConveniadoForm formAction="edit" />
        },
        {
            path: '/profissionais',
            element: <ProfissionaisList />
        },
        {
            path: '/profissional/criar',
            element: <ProfissionalForm formAction="add" />
        },
        {
            path: '/profissional/editar/:id',
            element: <ProfissionalForm formAction="edit" />
        },
        {
            path: '/associados',
            element: <AssociadosList />
        },
        {
            path: '/associado/criar',
            element: <AssociadoForm formAction="add" />
        },
        {
            path: '/associado/editar/:id',
            element: <AssociadoForm formAction="edit" />
        }
    ]
};

export default MainRoutes;
