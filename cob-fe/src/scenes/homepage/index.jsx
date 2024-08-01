import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import Login from "../login";
import Registration from "../registration";

const HomePage = () => {
  const theme = useTheme();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Effect to automatically open login modal after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        setLoginOpen(true);
        setRegistrationOpen(false); // Close registration modal
      }, 3000); // 5000 milliseconds = 5 seconds
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess]);

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setRegistrationOpen(false); // Ensure registration modal is closed when login modal opens
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleRegistrationOpen = () => {
    setRegistrationOpen(true);
  };

  const handleRegistrationClose = () => {
    setRegistrationOpen(false);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setRegistrationOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <img
            src={
              "https://flexyproddialer.idfcfirstbank.com/static/images/flexydial-logo.png"
            }
            alt="Flexydial Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Button
            color="inherit"
            onClick={handleLoginOpen}
            sx={{ mr: 2, fontWeight: "bold" }}
          >
            Sign-in
          </Button>
          <Button
            color="inherit"
            onClick={handleRegistrationOpen}
            variant="outlined"
            sx={{ fontWeight: "bold", borderColor: theme.palette.primary.main }}
          >
            Registration
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={loginOpen} onClose={handleLoginClose}>
        <DialogTitle>
          Sign-in
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleLoginClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Login setLoginOpen={setLoginOpen} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={registrationOpen}
        onClose={handleRegistrationClose}
        disableBackdropClick={registrationSuccess}
      >
        <DialogTitle>
          Registration
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleRegistrationClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Registration
            onSuccess={handleRegistrationSuccess}
            openLoginModal={handleLoginOpen}
          />
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#f0f4f9",
          position: "relative",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Flexydial
        </Typography>
        <Typography variant="h5" gutterBottom>
          Connectivity at ease..
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            mt: 2,
          }}
        >
          Explore..
        </Button>
      </Box>

      <Box
        sx={{
          padding: "50px",
          backgroundColor: "white",
          textAlign: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Featured Content
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Business Flashcard 1
            </Typography>
            <Typography variant="body2" gutterBottom>
              Description of Business Flashcard 1
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Business Flashcard 2
            </Typography>
            <Typography variant="body2" gutterBottom>
              Description of Business Flashcard 2
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#333",
          color: "white",
          textAlign: "center",
          padding: "20px",
          bottom: "0",
          width: "100%",
          zIndex: 9999,
        }}
      >
        <Typography variant="body1">All rights reserved. 2024</Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
