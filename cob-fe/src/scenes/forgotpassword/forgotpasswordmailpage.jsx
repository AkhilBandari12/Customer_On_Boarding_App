import React, { useState ,useEffect} from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
// import {Dialog,DialogTitle, DialogContent,DialogContentText,DialogActions,handleCloseDialog ,openDialog} from '@mui/material';
import axios from 'axios';


const ForgotPasswordMailPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    if (message === 'Check your mail') {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect to dashboard page after 10 seconds
      }, 10000);

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }
  }, [message]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8001/accounts/api/forgot-password/', { email });

      if (response.data && response.data.message === 'Check your mail') {
        setMessage(response.data.message);
        setError('');
        setTimeout(() => {
          window.location.href="/";
        }, 10000); 
      } else {
        setError('please check your mail for reset password');
        setMessage('');
        setTimeout(() => {
        window.location.href="/";
      }, 10000); 
      }
    } catch (err) {
      console.error('Error during password reset request:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Please Enter Correct Email');
      }
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm" align='center' sx={{ paddingTop: 25 }}>
      <Box mt={5} p={3} boxShadow={3}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
        {message && (
          <Typography color="primary" mt={2}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

      </Box>
    </Container>
  );
};  

export default ForgotPasswordMailPage;