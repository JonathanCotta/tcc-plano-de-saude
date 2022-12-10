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
    children: [
        {
            id: 'addPlano',
            title: 'Criar',
            type: 'item',
            url: '/plano/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listPlanos',
            title: 'Listar',
            type: 'item',
            url: '/planos',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default planos;
