// assets
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA especialidades ||============================== //

const planos = {
    id: 'plano',
    title: 'Planos',
    type: 'group',
    allowedUsers: ['admin'],
    children: [
        {
            id: 'addPlano',
            title: 'Criar',
            type: 'item',
            url: '/plano/criar',
            icon: icons.PlusCircleOutlined,
            target: false,
            allowedUsers: ['admin']
        },
        {
            id: 'listPlanos',
            title: 'Listar',
            type: 'item',
            url: '/planos',
            icon: icons.UnorderedListOutlined,
            target: false,
            allowedUsers: ['admin']
        }
    ]
};

export default planos;
