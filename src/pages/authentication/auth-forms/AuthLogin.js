import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {
    Button,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { doc, getDoc } from 'firebase/firestore';
import { setUser } from 'store/reducers/user';

import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { auth, db } from 'firebaseApp';

const AuthLogin = () => {
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const formInitalValues = {
        email: '',
        password: ''
    };

    const formValidation = Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
    });

    const formSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
        const { email, password } = values;
        try {
            const response = await signInWithEmailAndPassword(email, password);

            if (response) {
                const docRef = doc(db, 'users', response.user.uid);
                const docSnap = await getDoc(docRef);
                const userData = docSnap.data();
                if (userData) {
                    setUser(userData);
                    setStatus({ success: true });
                    setSubmitting(true);
                    return navigate('/');
                }
            }

            throw new Error('Usuário não encontrado');
        } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Formik
            initialValues={formInitalValues}
            validationSchema={formValidation}
            onSubmit={formSubmit}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
            }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="email-login">Email</InputLabel>
                                <OutlinedInput
                                    id="email"
                                    type="email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Digite o endereço de email"
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText
                                        error
                                        id="standard-weight-helper-text-email-login"
                                    >
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="password">Senha</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? (
                                                    <EyeOutlined />
                                                ) : (
                                                    <EyeInvisibleOutlined />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    placeholder="Digite sua senha"
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText
                                        error
                                        id="standard-weight-helper-text-password-login"
                                    >
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: -1 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Link
                                    variant="h6"
                                    component={RouterLink}
                                    to=""
                                    color="text.primary"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </Stack>
                        </Grid>
                        {errors.submit && (
                            <Grid item xs={12}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Login
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

export default AuthLogin;
