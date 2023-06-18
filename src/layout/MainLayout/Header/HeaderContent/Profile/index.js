import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    CardContent,
    ClickAwayListener,
    Grid,
    Paper,
    Popper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSignOut } from 'react-firebase-hooks/auth';

import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import { auth } from 'firebaseApp';
import { clearUser } from 'store/reducers/user';
import { UserOutlined } from '@ant-design/icons';
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [signOut, loading] = useSignOut(auth);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        const result = await signOut();

        if (loading && result) {
            dispatch(clearUser());
            navigate('/login', { replace: true });
        }
    };

    const handleToggle = () => {
        setOpen(() => !open);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const iconBackColorOpen = 'grey.300';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: open ? iconBackColorOpen : 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' }
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    <Avatar alt="profile user" sx={{ width: 32, height: 32 }} />
                    <Typography variant="subtitle1">{user.profile.nome}</Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        {open && (
                            <Paper
                                sx={{
                                    boxShadow: theme.customShadows.z1,
                                    width: 290,
                                    minWidth: 240,
                                    maxWidth: 290,
                                    [theme.breakpoints.down('md')]: {
                                        maxWidth: 250
                                    }
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard elevation={0} border={false} content={false}>
                                        <CardContent sx={{ px: 2.5, pt: 3 }}>
                                            <Grid
                                                container
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Grid item>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1.25}
                                                        alignItems="center"
                                                    >
                                                        <Stack>
                                                            <Typography variant="h6">
                                                                {`${user.profile.nome} ${user.profile.sobrenome}`}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                {user.profile.tipo}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        {open && (
                                            <>
                                                <Box
                                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                                >
                                                    <Tabs
                                                        variant="fullWidth"
                                                        value={value}
                                                        onChange={handleChange}
                                                        aria-label="abas de perfil"
                                                    >
                                                        <Tab
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textTransform: 'capitalize'
                                                            }}
                                                            icon={
                                                                <UserOutlined
                                                                    style={{
                                                                        marginBottom: 0,
                                                                        marginRight: '10px'
                                                                    }}
                                                                />
                                                            }
                                                            label="Perfil"
                                                            {...a11yProps(0)}
                                                        />
                                                    </Tabs>
                                                </Box>
                                                <TabPanel
                                                    value={value}
                                                    index={0}
                                                    dir={theme.direction}
                                                >
                                                    <ProfileTab
                                                        handleLogout={handleLogout}
                                                        userId={user.profile.uid}
                                                        userType={user.profile.tipo}
                                                    />
                                                </TabPanel>
                                            </>
                                        )}
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        )}
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile;
