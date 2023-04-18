import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Box, Card, Button, Container, Link, Snackbar, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearState, loginUser, userSelector } from '../../state/userSlice';
import logoImage from '../../images/logo.svg';

export const Login = (): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, errorMessage } = useSelector(userSelector);

  useEffect(() => {
    dispatch(clearState());
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  const forgotPassword = () => {
    navigate('/forgot-password');
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/app');
    }
  }, [isSuccess]);

  return (
    <Container component='main' maxWidth='xs'>
      <Box mt={12} textAlign={'center'}>
        <img src={logoImage} alt='Logo' loading='lazy' />
      </Box>
      <Card sx={{ p: 5, mt: 3 }}>
        <Typography component='h1' variant='h5'>
          Log in
        </Typography>

        <Box component='form' noValidate mt={1} textAlign={'center'} width={1} onSubmit={(e: FormEvent) => onSubmit(e)}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            onBlur={() => setUsernameTouched(true)}
            error={usernameTouched && !username}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          {usernameTouched && !username ? (
            <Typography sx={{ color: 'error.main' }} align='left' gutterBottom>
              Please enter a valid email address
            </Typography>
          ) : null}

          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onBlur={() => setPasswordTouched(true)}
            error={passwordTouched && !password}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {passwordTouched && !password ? (
            <Typography sx={{ color: 'error.main' }} align='left' gutterBottom>
              Password is required
            </Typography>
          ) : null}

          {isError ? (
            <Alert severity='error' sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          ) : null}
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={!username || !password}>
            Log in
          </Button>

          <Link variant='body2' onClick={forgotPassword} component='button'>
            Forgot password?
          </Link>
        </Box>
      </Card>
    </Container>
  );
};
