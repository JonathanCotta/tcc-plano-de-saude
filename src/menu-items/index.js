import especialidades from './especialidades';
import planos from './planos';
import conveniados from './conveniados';
import profissioanis from './profissionais';
import associados from './associados';
import consultas from './consultas';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [associados, consultas, especialidades, planos, conveniados, profissioanis]
};

export const getMenuItems = (user = {}) => {
    const { profile } = user;

    const filteredItems = menuItems.items.filter((item) => {
        if (item.allowedUsers.includes(profile.tipo)) {
            const { children } = item;

            item.children = children.filter((child) => child.allowedUsers.includes(profile.tipo));

            return item;
        }

        return null;
    });

    return { items: filteredItems };
};

export default {
    getMenuItems
};
