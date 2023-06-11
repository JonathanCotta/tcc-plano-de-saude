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
        },
        {
            path: '/consultas',
            element: <ConsultasList />
        },
        {
            path: '/consultas/criar/:id',
            element: <ConsultaForm formAction="add" />
        },
        {
            path: '/consultas/editar/:id',
            element: <ConsultaForm formAction="edit" />
        },
        {
            path: '/consultas/agendar',
            element: <ConsultasSchedule />
        }
    ]
};

export default MainRoutes;
