import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography, Divider, IconButton, InputAdornment } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Link as MuiLink } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';

const Login = ({ setNotifications }) => {
  const [notification, setNotification] = useState(null);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8001/accounts/api/login/', values);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('first_name', response.data.first_name);
      localStorage.setItem('last_name', response.data.last_name);
      localStorage.setItem('email', response.data.email);
      
      if (response.status === 200) {
        const newNotification = {
          type: 'success',
          message: 'Sign-in Successfull',
        };
        setNotification(newNotification);
        if (setNotifications) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification,
          ]);
        }
        setTimeout(() => {
          setRedirectToDashboard(true); // Smoothly redirect after 2 seconds
        }, 2000);
        setTimeout(() => {
          setNotification(null); // Clear notification after 5 seconds
        }, 5000);
      }
    } catch (error) {
      const newNotification = {
        type: 'error',
        message: 'Authentication Failed. Please check your credentials.',
      };
      setNotification(newNotification);
      if (setNotifications) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      }
      setTimeout(() => {
        setNotification(null); // Clear notification after 5 seconds
      }, 5000);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (redirectToDashboard) {
      const timer = setTimeout(() => {
        setRedirectToDashboard(false); // Reset redirect flag after redirection
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [redirectToDashboard]);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box>
      <br />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email/Username"
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {notification && (
        <Box mt={2} p={2} bgcolor={notification.type === 'success' ? '#4caf50' : '#f44336'} color="#fff" display="flex">
          <Typography variant="body1" style={{ flexGrow: 1 }}>
            {notification.message}
          </Typography>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseNotification}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}
      <br />
      <Divider />
      <Typography>
        Forgot Password? <MuiLink href="/forgot-password">Click here</MuiLink>
      </Typography>
    </Box>
  );
};

export default Login;
