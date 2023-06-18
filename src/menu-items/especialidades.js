// assets
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
    PlusCircleOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA especialidades ||============================== //

const especialidades = {
    id: 'especialidade',
    title: 'Especialidades',
    type: 'group',
    allowedUsers: ['admin', 'profissional'],
    children: [
        {
            id: 'addEspecialidade',
            title: 'Criar',
            type: 'item',
            url: '/especialidade/criar',
            icon: icons.PlusCircleOutlined,
            target: false,
            allowedUsers: ['admin', 'profissional']
        },
        {
            id: 'listEspecialidades',
            title: 'Listar',
            type: 'item',
            url: '/especialidades',
            icon: icons.UnorderedListOutlined,
            target: false,
            allowedUsers: ['admin', 'profissional']
        }
    ]
};

export default especialidades;
