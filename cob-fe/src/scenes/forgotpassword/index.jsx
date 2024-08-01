import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography, Box, Container, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
const ForgotConfirmPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New Passwords and Confirm Password should be the same.');
      setOpenErrorSnackbar(true);
      setMessage('');
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8001/accounts/api/forgot-confirmpassword/${uidb64}/${token}/`,
        { new_password: newPassword },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setMessage(response.data.detail);
      setOpenSnackbar(true);
      setError('');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        switch (detail) {
          case 'Password should not be less than 8 characters':
            setError('Password should not be less than 8 characters');
            break;
          case 'New password should not be the same as the old password.':
            setError('New password should not be the same as the old password.');
            break;
          case 'Invalid token.':
            setError('Invalid token. Please try the reset process again.');
            break;
          case 'This password reset link has already been used.':
            setError('This password reset link has already been used.');
            break;
          case 'This password reset link has expired.':
            setError('This password reset link has expired.');
            break;
          default:
            setError(detail);
            break;
        }
      } else {
        setError('An error occurred. Please try again.');
      }
      setOpenErrorSnackbar(true);
      setMessage('');
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setOpenErrorSnackbar(false);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <Container maxWidth="sm" align="center" sx={{ paddingTop: 25 }}>
      <Box mt={5} p={3} boxShadow={3}>
        <Typography variant="h4" gutterBottom>
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility} edge="end">
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </Box>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {message || 'Your password has been updated successfully.'}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
export default ForgotConfirmPassword;