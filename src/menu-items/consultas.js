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
    children: [
        {
            id: 'addConsulta',
            title: 'Criar',
            type: 'item',
            url: '/consultas/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listConsultas',
            title: 'Listar',
            type: 'item',
            url: '/consultas',
            icon: icons.UnorderedListOutlined,
            target: false
        },
        {
            id: 'listConveniados',
            title: 'Agendar',
            type: 'item',
            url: '/consultas/agendar',
            icon: icons.ScheduleOutlined,
            target: false
        }
    ]
};

export default consultas;
