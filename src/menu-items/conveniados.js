// assets
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA especialidades ||============================== //

const conveniados = {
    id: 'conveniado',
    title: 'Conveniados',
    type: 'group',
    allowedUsers: ['admin'],
    children: [
        {
            id: 'addConveniado',
            title: 'Criar',
            type: 'item',
            url: '/conveniado/criar',
            icon: icons.PlusCircleOutlined,
            target: false,
            allowedUsers: ['admin']
        },
        {
            id: 'listConveniados',
            title: 'Listar',
            type: 'item',
            url: '/conveniados',
            icon: icons.UnorderedListOutlined,
            target: false,
            allowedUsers: ['admin']
        }
    ]
};

export default conveniados;
