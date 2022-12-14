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
    children: [
        {
            id: 'addEspecialidade',
            title: 'Criar',
            type: 'item',
            url: '/especialidade/criar',
            icon: icons.PlusCircleOutlined,
            target: false
        },
        {
            id: 'listEspecialidades',
            title: 'Listar',
            type: 'item',
            url: '/especialidades',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default especialidades;
