import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Box, Card, Button, Container, Link, Snackbar, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPassword, userSelector } from '../../state/userSlice';
import logoImage from '../../images/logo.svg';
import { AppDispatch } from '../../state/store';

export const ForgotPassword = (): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isSuccess, isError, errorMessage } = useSelector(userSelector);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ username }));
  };

  const backToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(backToLogin, 2000);
    }
  }, [isSuccess, isError]);

  return (
    <Container component='main' maxWidth='xs'>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={isSuccess} autoHideDuration={2000}>
        <Alert severity='success'>Password reset successfully</Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={isError} autoHideDuration={2000}>
        <Alert severity='error'>{errorMessage}</Alert>
      </Snackbar>

      <Box mt={11} textAlign={'center'} width={1}>
        <img src={logoImage} alt='Logo' loading='lazy' />
      </Box>

      <Card sx={{ p: 5, mt: 3 }}>
        <Typography component='h1' variant='h5'>
          Forgot password
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
            onBlur={() => setUsernameTouched(true)}
            error={usernameTouched && !username}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          {usernameTouched && !username ? (
            <Typography sx={{ color: 'error.main' }} align='left' gutterBottom>
              Username is required
            </Typography>
          ) : null}

          <Alert severity='error' sx={{ mt: 2 }}>
            Invalid email or password
          </Alert>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={!username}>
            Reset password
          </Button>

          <Link variant='body2' onClick={backToLogin} component='button'>
            Back to login
          </Link>
        </Box>
      </Card>
    </Container>
  );
};
