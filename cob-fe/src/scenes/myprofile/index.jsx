import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Tabs, Tab, Button, Avatar } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/accounts/api/myprofile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [accessToken]); // Add accessToken to the dependency array to fetch data on token change

  return (
    <Container sx={{ marginTop: '3%', marginBottom: '3%' }}>
      {userData && ( // Check if userData is not null
        <>
          <Grid container spacing={3}>
            <Grid item md={4}>
              <div style={{ textAlign: 'center' }}>
                <Avatar alt="Profile Picture" src="https://cdn-icons-png.flaticon.com/512/3031/3031702.png" sx={{ width: 150, height: 150, marginBottom: '20px' }} />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className="profile-head">
                <Typography variant="h5" gutterBottom>{`${userData.first_name} ${userData.last_name}`}</Typography>
                <Typography variant="h6" gutterBottom>{userData.role}</Typography>
                <Tabs value={0} aria-label="profile tabs">
                  <Tab label="About" />
                </Tabs>
              </div>
            </Grid>
            <Grid item md={2}>
            {role === "Client" &&(
                // <Button
                //   variant="contained"
                //   className="profile-edit-btn"
                //   size="large"
                //   component={Link}
                //   to="/edit-myprofile" // Link to edit-myprofile page
                // >
              <Button variant="contained" className="profile-edit-btn" size="large" component={Link} to="/edit-myprofile" >Edit Profile</Button>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {role === "Client" && (
              <Grid item md={4}>
                <div className="profile-work">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >Company Name</Typography>
                  <Typography variant="body1">{userData.company_name}</Typography>
                  <br />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Country</Typography>
                  <Typography variant="body1">{userData.country}</Typography>
                  <br />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>City</Typography>
                  <Typography variant="body1">{userData.city}</Typography>
                  <br />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Address</Typography>
                  <Typography variant="body1">{userData.address}</Typography>
                  <br />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Employee Count</Typography>
                  <Typography variant="body1">{userData.employee_count}</Typography>
                  <br />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Product</Typography>
                  <Typography variant="body1">{userData.product}</Typography>
                </div>
              </Grid>
            )}
            <Grid item md={8}>
              <div className="tab-content profile-tab">
                <div className="tab-pane fade show active">
                  <Grid container spacing={2}>
                    {/* <Grid item md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Username</Typography>
                      <Typography variant="body1">{userData.username}</Typography>
                    </Grid> */}
                    <Grid item md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Email</Typography>
                      <Typography variant="body1">{userData.email}</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Role</Typography>
                      <Typography variant="body1">{userData.role}</Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default MyProfile;
