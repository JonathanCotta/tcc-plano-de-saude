// assets
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA associados ||============================== //

const associados = {
    id: 'associados',
    title: 'Associados',
    type: 'group',
    children: [
        {
            id: 'addAssociado',
            title: 'Criar',
            type: 'item',
            url: '/associado/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listAssociados',
            title: 'Listar',
            type: 'item',
            url: '/associados',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default associados;
