// assets
import { PlusCircleOutlined, UnorderedListOutlined, ScheduleOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined,
    ScheduleOutlined
};

// ==============================|| MENU ITEMS - EXTRA especialidades ||============================== //

const consultas = {
    id: 'consulta',
    title: 'Consultas',
    type: 'group',
    allowedUsers: ['admin', 'profissional', 'associado'],
    children: [
        {
            id: 'addConsulta',
            title: 'Criar',
            type: 'item',
            url: '/consultas/criar',
            icon: icons.PlusCircleOutlined,
            target: false,
            allowedUsers: ['admin', 'profissional']
        },
        {
            id: 'listConsultas',
            title: 'Listar',
            type: 'item',
            url: '/consultas',
            icon: icons.UnorderedListOutlined,
            target: false,
            allowedUsers: ['admin', 'profissional', 'associado']
        },
        {
            id: 'listConveniados',
            title: 'Agendar',
            type: 'item',
            url: '/consultas/agendar',
            icon: icons.ScheduleOutlined,
            target: false,
            allowedUsers: ['admin', 'profissional', 'associado']
        }
    ]
};

export default consultas;
