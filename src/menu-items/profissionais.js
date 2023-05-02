// assets
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA profissioanis ||============================== //

const profissioanis = {
    id: 'profissional',
    title: 'Profissionais',
    type: 'group',
    children: [
        {
            id: 'addProfissional',
            title: 'Criar',
            type: 'item',
            url: '/profissional/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listProfissionais',
            title: 'Listar',
            type: 'item',
            url: '/profissionais',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default profissioanis;
