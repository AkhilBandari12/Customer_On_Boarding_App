import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, TextField, MenuItem, Container, Box, Snackbar, Alert } from '@mui/material';

const EditMyProfile = () => {
    const [userProfile, setUserProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile_number: '',
        company_name: '',
        country: '',
        city: '',
        address: '',
        employee_count: '',
        product: '',
        role: '',
    });
    const [isSubmitting, setSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const role = localStorage.getItem('role');
                if (!accessToken || !role) {
                    throw new Error('Access token or role not found in localStorage');
                }
                const response = await axios.get('http://127.0.0.1:8001/accounts/api/myprofile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const userData = response.data;
                setUserProfile({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    mobile_number: userData.mobile_number,
                    company_name: userData.company_name,
                    country: userData.country,
                    city: userData.city,
                    address: userData.address,
                    employee_count: userData.employee_count,
                    product: userData.product,
                    role: userData.role,
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                handleFetchError();
            }
        };
        fetchUserProfile();
    }, []);
    const handleFetchError = () => {
        // Handle error scenarios, e.g., redirect to login if token expired
        // For now, simply set a notification
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to fetch user profile');
        setSnackbarOpen(true);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            const { product } = userProfile;
            const accessToken = localStorage.getItem('accessToken');
            const role = localStorage.getItem('role');
            if (!accessToken || !role) {
                throw new Error('Access token or role not found in localStorage');
            }
            const response = await axios.patch(
                'http://127.0.0.1:8001/accounts/api/myprofile/',
                { product },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setSnackbarSeverity('success');
                setSnackbarMessage('Profile updated successfully');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSubmitting(false);
                    setSnackbarOpen(false);
                }, 5000);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to update profile');
            setSnackbarOpen(true);
            setSubmitting(false);
        }
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
return (
        <Container sx={{ width: 1000, marginBottom: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, paddingRight: 2, paddingLeft: 2, paddingTop: 4 }}>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="first_name"
                                label="First Name"
                                value={userProfile.first_name}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="last_name"   label="Last Name" value={userProfile.last_name}  onChange={handleChange}
                                fullWidth disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="role" label="Role"  value={userProfile.role}onChange={handleChange}
                                fullWidth disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email address"
                                value={userProfile.email}
                                onChange={handleChange}
                                fullWidth
                                 disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mobile_number"
                                label="Mobile Number"
                                value={userProfile.mobile_number}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="company_name"
                                label="Company Name"
                                value={userProfile.company_name}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="country"
                                label="Country"
                                value={userProfile.country}
                                onChange={handleChange}
                                fullWidth
                                // InputProps={{
                                //     readOnly: true,
                                // }}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="city"
                                label="City"
                                value={userProfile.city}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                label="Address"
                                value={userProfile.address}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="employee_count"
                                select
                                label="Employee Count"
                                value={userProfile.employee_count}
                                onChange={handleChange}
                                fullWidth
                                disabled
                            >
                                <MenuItem value="0-50">0-50</MenuItem>
                                <MenuItem value="50-100">50-100</MenuItem>
                                <MenuItem value="100-500">100-500</MenuItem>
                                <MenuItem value="500-2000">500-2000</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="product"
                                select
                                label="Product"
                                value={userProfile.product}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="Voice Solution">Voice Solution</MenuItem>
                                <MenuItem value="ChatBots">ChatBots</MenuItem>
                                <MenuItem value="Education">Education</MenuItem>
                                <MenuItem value="Email Solution">Email Solution</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                fullWidth
                                size="large"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => window.location.href = '/myprofile'}
                            >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{marginLeft:58}}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};
export default EditMyProfile;