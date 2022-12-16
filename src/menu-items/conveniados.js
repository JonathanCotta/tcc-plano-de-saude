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
    children: [
        {
            id: 'addConveniado',
            title: 'Criar',
            type: 'item',
            url: '/conveniado/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listConveniados',
            title: 'Listar',
            type: 'item',
            url: '/conveniados',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default conveniados;
