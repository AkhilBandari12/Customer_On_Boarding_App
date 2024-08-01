import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { IconButton, InputAdornment } from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      setAlertMessage('The new password cannot be the same as the old password!');
      setAlertSeverity('error');
      return;
    }
    if (!validatePassword(newPassword)) {
        setAlertMessage('Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character!');
        setAlertSeverity('error');
        return;
      }
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setAlertMessage('New Password and Confirm Password do not match!');
      setAlertSeverity('error');
      return;
    }
    const data = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://127.0.0.1:8001/accounts/api/change-password/', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Form submitted successfully:', response.data);
      setAlertMessage('Password updated successfully!');
      setAlertSeverity('success');
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("email");
      setTimeout(() => {
        window.location.href = '/';
      }, 4000);
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      const errorMessage = error.response && error.response.data && error.response.data.old_password
        ? error.response.data.old_password[0]
        : 'There was an error updating the password!';
      setAlertMessage(errorMessage);
      setAlertSeverity('error');
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>Change/Reset Password</Typography>
      {alertMessage && (
        <Alert variant="filled" severity={alertSeverity} sx={{ mb: 2, width: '100%' }}>
          {alertMessage}
        </Alert>
      )}
      <TextField
        label="Old Password"
        type={showOldPassword ? 'text' : 'password'}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        margin="normal"
        sx={{ width: '100%' }}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleOldPasswordVisibility} edge="end">
                {showOldPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="New Password"
        type={showNewPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        sx={{ width: '100%' }}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleNewPasswordVisibility} edge="end">
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm New Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        sx={{ width: '100%' }}
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
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
        Change Password
      </Button>
    </Box>
  );
};

export default ChangePassword;
