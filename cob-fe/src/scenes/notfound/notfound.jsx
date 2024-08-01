import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

function NotFound() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2" align="center" gutterBottom>
              <ErrorOutline fontSize="large" color="error" /> 404
            </Typography>
            <Typography variant="h3" align="center" gutterBottom>
              Oops! You're lost.
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              The page you are looking for was not found.
            </Typography>
            <Grid container justifyContent="center" item xs={12}>
              <Button component={Link} to="/" variant="contained" color="primary">
                Back to Home
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

export default NotFound;
