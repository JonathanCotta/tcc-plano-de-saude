import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { EditOutlined, LogoutOutlined } from '@ant-design/icons';

const ProfileTab = ({ handleLogout, userId, userType }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);

        if (index === 0) {
            navigate(`/${userType}/editar/${userId}`);
        }
    };

    return (
        <List
            component="nav"
            sx={{
                p: 0,
                '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] }
            }}
        >
            <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
            >
                <ListItemIcon>
                    <EditOutlined />
                </ListItemIcon>
                <ListItemText primary="Editar Perfil" />
            </ListItemButton>
            <ListItemButton selected={selectedIndex === 1} onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </List>
    );
};

ProfileTab.propTypes = {
    userId: PropTypes.string,
    userType: PropTypes.string,
    handleLogout: PropTypes.func
};

export default ProfileTab;
