import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import { setUser } from 'store/reducers/user';
import { auth, db } from 'firebaseApp';

export const Auth = ({ children }) => {
    const userLocal = useSelector((state) => state.user);
    const [user, authLoading] = useAuthState(auth);
    const { pathname } = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const exceptionUrl = useMemo(() => ['/login', '/register'], []);

    const checkLocalUser = (userArg) => {
        const { isLogged, profile } = userArg;

        return isLogged && profile.hasOwnProperty('uid');
    };

    const getUserData = useCallback(
        async (userId) => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));

                if (userDoc.exists()) {
                    return dispatch(setUser(userDoc.data()));
                }

                throw 'Usuário não encontrado';
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        },
        [dispatch, navigate]
    );

    useEffect(() => {
        if (!exceptionUrl.includes(pathname)) {
            if (!user && !authLoading) navigate('/login');

            const isAssociadoEdit = /\/associado\/editar\//.test(pathname);

            if (user && !checkLocalUser(userLocal) && !isAssociadoEdit) getUserData(user.uid);
        }
    }, [getUserData, authLoading, navigate, user, userLocal, exceptionUrl, pathname]);

    return <>{children}</>;
};

Auth.propTypes = {
    children: PropTypes.node
};

export default Auth;
