import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import { getMainRoutes } from './MainRoutes';
import { useSelector } from 'react-redux';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const userData = useSelector((state) => state.user);

    const MainRoutes = getMainRoutes(userData);

    return useRoutes([MainRoutes, LoginRoutes]);
}
