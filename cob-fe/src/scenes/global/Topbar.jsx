// import React, { useState, useEffect } from "react";
// import { Box, IconButton, Menu, MenuItem, Badge, Typography } from "@mui/material";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Icon for mark as read
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Icon for delete
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import ChangePassword from "../changepassword";

// const Topbar = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userAnchorEl, setUserAnchorEl] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("accessToken");
//   const role = localStorage.getItem("role");
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/notifications/', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setNotifications(response.data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     }

//     fetchNotifications();
//   }, []);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUserMenuOpen = (event) => {
//     setUserAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setUserAnchorEl(null);
//   };

//   const handleNotificationClick = async (event, notification) => {
//     event.preventDefault();
//     try {
//       await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/notifications/modify/${notification.id}/`,
//         { read: true },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       // Update local state to mark notification as read
//       const updatedNotifications = notifications.map(item =>
//         item.id === notification.id ? { ...item, read: true } : item
//       );
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8001/accounts/api/notifications/modify/${notificationId}/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Remove deleted notification from local state
//       const updatedNotifications = notifications.filter(item => item.id !== notificationId);
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteAllNotifications = async () => {
//     try {
//       await axios.delete('http://127.0.0.1:8001/accounts/api/notifications/delete-notifications/', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Clear all notifications from local state
//       setNotifications([]);
//     } catch (error) {
//       console.error('Error deleting all notifications:', error);
//     }
//     handleMenuClose();
//   };

//   const handleLogout = () => {
//     // Clearing localStorage items
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('role');
//     localStorage.removeItem('first_name');
//     localStorage.removeItem('last_name');
//     localStorage.removeItem('email');
//     // Navigating to the home on logging out
//     navigate('/');
//   };

//   // Calculate number of unread notifications
//   const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

//   return (
//     <Box display="flex" justifyContent="space-between" p={2}>
//       {/* SEARCH BAR */}
//       <Box>
//       </Box>

//       {/* ICONS */}
//       <Box display="flex">
//         <IconButton onClick={handleMenuOpen}>
//           <Badge badgeContent={unreadNotificationsCount > 0 ? unreadNotificationsCount : null} color="error">
//             <NotificationsOutlinedIcon />
//           </Badge>
//         </IconButton>
//         <IconButton onClick={handleUserMenuOpen}>
//           <PersonOutlinedIcon />
//         </IconButton>
//       </Box>

//       {/* Notifications Dropdown */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         {notifications.slice(0, 5).map((notification) => (
//           <MenuItem key={notification.id}>
//             <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
//               <Typography sx={{ marginRight: '8px' }}>{notification.message}</Typography>
//               <Box display="flex" alignItems="center">
//                 {!notification.read && (
//                   <IconButton onClick={(event) => handleNotificationClick(event, notification)} sx={{ bgcolor: '#498EE2', color: 'white', borderRadius: '50%', padding: '4px', marginRight: '8px' }}>
//                     <CheckCircleOutlineIcon fontSize="small"/>
//                   </IconButton>
//                 )}
//                 <IconButton onClick={() => deleteNotification(notification.id)} sx={{ bgcolor: '#EC0C23', color: 'white', borderRadius: '50%', padding: '4px' }}>
//                   <DeleteOutlineIcon fontSize="small"/>
//                 </IconButton>
//               </Box>
//             </Box>
//           </MenuItem>
//         ))}
//         {notifications.length === 0 && (
//           <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
//         )}
//         {notifications.length !== 0 && (
//           <MenuItem onClick={deleteAllNotifications} sx={{ bgcolor: '#817B78' }}>
//             Clear All
//           </MenuItem>
//         )}
//       </Menu>

//       {/* User Dropdown */}
//       <Menu
//         anchorEl={userAnchorEl}
//         open={Boolean(userAnchorEl)}
//         onClose={handleUserMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         <MenuItem>
//           <Typography variant="body1">
//             Email: {email}
//           </Typography>
//         </MenuItem>
//         <MenuItem>
//           <Typography variant="body1">
//             Change Password
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleLogout}>
//           Logout
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Topbar;





import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Icon for mark as read
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Icon for delete
import CloseIcon from "@mui/icons-material/Close"; // Icon for close
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../changepassword";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false); // State for ChangePassword modal
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8001/accounts/api/notifications/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    fetchNotifications();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleNotificationClick = async (event, notification) => {
    event.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8001/accounts/api/notifications/modify/${notification.id}/`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Update local state to mark notification as read
      const updatedNotifications = notifications.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    handleMenuClose();
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8001/accounts/api/notifications/modify/${notificationId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Remove deleted notification from local state
      const updatedNotifications = notifications.filter(
        (item) => item.id !== notificationId
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
    handleMenuClose();
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete(
        "http://127.0.0.1:8001/accounts/api/notifications/delete-notifications/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Clear all notifications from local state
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
    handleMenuClose();
  };

  const handleLogout = () => {
    // Clearing localStorage items
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("email");
    // Navigating to the home on logging out
    navigate("/");
  };

  // Calculate number of unread notifications
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Open ChangePassword modal
  const openChangePasswordModal = () => {
    setChangePasswordOpen(true);
  };

  // Close ChangePassword modal
  const closeChangePasswordModal = () => {
    setChangePasswordOpen(false);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleMenuOpen}>
          <Badge
            badgeContent={unreadNotificationsCount > 0 ? unreadNotificationsCount : null}
            color="error"
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleUserMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ minWidth: "240px" }}
      >
        {notifications.slice(0, 5).map((notification) => (
          <MenuItem key={notification.id}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Typography sx={{ marginRight: "8px" }}>
                {notification.message}
              </Typography>
              <Box display="flex" alignItems="center">
                {!notification.read && (
                  <IconButton
                    onClick={(event) =>
                      handleNotificationClick(event, notification)
                    }
                    sx={{
                      bgcolor: "#498EE2",
                      color: "white",
                      borderRadius: "50%",
                      padding: "4px",
                      marginRight: "8px",
                    }}
                  >
                    <CheckCircleOutlineIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => deleteNotification(notification.id)}
                  sx={{
                    bgcolor: "#EC0C23",
                    color: "white",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </MenuItem>
        ))}
        {notifications.length === 0 && (
          <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
        )}
        {notifications.length !== 0 && (
          <MenuItem onClick={deleteAllNotifications} sx={{ bgcolor: "#817B78" }}>
            Clear All
          </MenuItem>
        )}
      </Menu>

      {/* User Dropdown */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
        sx={{ minWidth: "240px" }}
      >
        <MenuItem>
          <Typography variant="body1">Email: {email}</Typography>
        </MenuItem>
        <MenuItem onClick={openChangePasswordModal}>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* ChangePassword Modal */}
      <Modal
        open={changePasswordOpen}
        onClose={closeChangePasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={changePasswordOpen}>
          <Box
            sx={{
              backgroundColor: "white",
              boxShadow: 24,
              padding: 3,
              width: 400,
              maxWidth: "90%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Close button */}
            <IconButton
              aria-label="close"
              onClick={closeChangePasswordModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#666",
              }}
            >
              <CloseIcon />
            </IconButton>
            <ChangePassword />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Topbar;






// import React, { useState, useEffect } from "react";
// import { Box, IconButton, Menu, MenuItem, Badge, Typography } from "@mui/material";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// const Topbar = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userAnchorEl, setUserAnchorEl] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("accessToken");
//   const role = localStorage.getItem("role");
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/notifications/',
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         setNotifications(response.data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     }

//     fetchNotifications();
//   }, []);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUserMenuOpen = (event) => {
//     setUserAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setUserAnchorEl(null);
//   };

//   const handleNotificationClick = async (event, notification) => {
//     event.preventDefault();
//     try {
//       await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/notifications/modify/${notification.id}/`,
//         { read: true },  // Include the payload here
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       // Update local state to mark notification as read
//       const updatedNotifications = notifications.map(item =>
//         item.id === notification.id ? { ...item, read: true } : item
//       );
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8001/accounts/api/notifications/modify/${notificationId}/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Remove deleted notification from local state
//       const updatedNotifications = notifications.filter(item => item.id !== notificationId);
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteAllNotifications = async () => {
//     try {
//       await axios.delete('http://127.0.0.1:8001/accounts/api/notifications/delete-notifications/', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Clear all notifications from local state
//       setNotifications([]);
//     } catch (error) {
//       console.error('Error deleting all notifications:', error);
//     }
//     handleMenuClose();
//   };

//   const handleLogout = () => {
//     // Clearing localStorage items
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('role');
//     localStorage.removeItem('first_name');
//     localStorage.removeItem('last_name');
//     localStorage.removeItem('email');
//     // Navigating to the home on logging out
//     navigate('/');
//   };

//   return (
//     <Box display="flex" justifyContent="space-between" p={2}>
//       {/* SEARCH BAR */}
//       <Box>
//       </Box>

//       {/* ICONS */}
//       <Box display="flex">
//         <IconButton onClick={handleMenuOpen}>
//           <Badge badgeContent={notifications.length > 0 ? notifications.length : null} color="error">
//             <NotificationsOutlinedIcon />
//           </Badge>
//         </IconButton>
//         <IconButton onClick={handleUserMenuOpen}>
//           <PersonOutlinedIcon />
//         </IconButton>
//       </Box>

//       {/* Notifications Dropdown */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         {notifications.slice(0, 5).map((notification) => (
//           <MenuItem key={notification.id} onClick={(event) => handleNotificationClick(event, notification)}>
//             {notification.message}
//             <IconButton onClick={() => deleteNotification(notification.id)}>Delete</IconButton>
//           </MenuItem>
//         ))}
//         {notifications.length === 0 && (
//           <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
//         )}
//         <MenuItem onClick={deleteAllNotifications}>Clear All</MenuItem>
//       </Menu>

//       {/* User Dropdown */}
//       <Menu
//         anchorEl={userAnchorEl}
//         open={Boolean(userAnchorEl)}
//         onClose={handleUserMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         <MenuItem>
//           <Typography variant="body1">
//             Email : {email}
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleLogout}>
//           Logout
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Topbar;






// import React, { useState, useEffect } from "react";  --new 14:37 june 19 
// import { Box, IconButton, Menu, MenuItem, Badge, Typography } from "@mui/material";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Icon for mark as read
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Icon for delete
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// const Topbar = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userAnchorEl, setUserAnchorEl] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem("accessToken");
//   const role = localStorage.getItem("role");
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/notifications/', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setNotifications(response.data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     }

//     fetchNotifications();
//   }, []);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUserMenuOpen = (event) => {
//     setUserAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setUserAnchorEl(null);
//   };

//   const handleNotificationClick = async (event, notification) => {
//     event.preventDefault();
//     try {
//       await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/notifications/modify/${notification.id}/`,
//         { read: true },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       // Update local state to mark notification as read
//       const updatedNotifications = notifications.map(item =>
//         item.id === notification.id ? { ...item, read: true } : item
//       );
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8001/accounts/api/notifications/modify/${notificationId}/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Remove deleted notification from local state
//       const updatedNotifications = notifications.filter(item => item.id !== notificationId);
//       setNotifications(updatedNotifications);
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//     handleMenuClose();
//   };

//   const deleteAllNotifications = async () => {
//     try {
//       await axios.delete('http://127.0.0.1:8001/accounts/api/notifications/delete-notifications/', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       // Clear all notifications from local state
//       setNotifications([]);
//     } catch (error) {
//       console.error('Error deleting all notifications:', error);
//     }
//     handleMenuClose();
//   };

//   const handleLogout = () => {
//     // Clearing localStorage items
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('role');
//     localStorage.removeItem('first_name');
//     localStorage.removeItem('last_name');
//     localStorage.removeItem('email');
//     // Navigating to the home on logging out
//     navigate('/');
//   };

//   return (
//     <Box display="flex" justifyContent="space-between" p={2}>
//       {/* SEARCH BAR */}
//       <Box>
//       </Box>

//       {/* ICONS */}
//       <Box display="flex">
//         <IconButton onClick={handleMenuOpen}>
//           <Badge badgeContent={notifications.length > 0 ? notifications.length : null} color="error">
//             <NotificationsOutlinedIcon />
//           </Badge>
//         </IconButton>
//         <IconButton onClick={handleUserMenuOpen}>
//           <PersonOutlinedIcon />
//         </IconButton>
//       </Box>

//       {/* Notifications Dropdown */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         {notifications.slice(0, 5).map((notification) => (
//           <MenuItem key={notification.id}>
//             <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
//               <Typography sx={{ marginRight: '8px' }}>{notification.message}</Typography>
//               <Box display="flex" alignItems="center">
//                 {!notification.read && (
//                   <IconButton onClick={(event) => handleNotificationClick(event, notification)} sx={{ bgcolor: '#498EE2', color: 'white', borderRadius: '50%', padding: '4px', marginRight: '8px' }}>
//                     <CheckCircleOutlineIcon fontSize="small"/>
//                   </IconButton>
//                 )}
//                 <IconButton onClick={() => deleteNotification(notification.id)} sx={{ bgcolor: '#EC0C23', color: 'white', borderRadius: '50%', padding: '4px' }}>
//                   <DeleteOutlineIcon fontSize="small"/>
//                 </IconButton>
//               </Box>
//             </Box>
//           </MenuItem>
//         ))}
//         {notifications.length === 0 && (
//           <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
//         )}
//         {notifications.length !== 0 && (
//           <MenuItem onClick={deleteAllNotifications} sx={{ bgcolor: '#817B78' }}>
//             Clear All
//           </MenuItem>
//         )}
//       </Menu>

//       {/* User Dropdown */}
//       <Menu
//         anchorEl={userAnchorEl}
//         open={Boolean(userAnchorEl)}
//         onClose={handleUserMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         <MenuItem>
//           <Typography variant="body1">
//             Email: {email}
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleLogout}>
//           Logout
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Topbar;


















// import { Box, IconButton, Menu, MenuItem, Badge, useTheme, InputBase, Typography } from "@mui/material";
// import { useContext, useState } from "react";
// import { ColorModeContext, tokens } from "../../theme";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SearchIcon from "@mui/icons-material/Search";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import { useNavigate } from 'react-router-dom';


// const Topbar = ({ notifications }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const colorMode = useContext(ColorModeContext);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userAnchorEl, setUserAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const email =  localStorage.getItem('email');

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUserMenuOpen = (event) => {
//     setUserAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setUserAnchorEl(null);
//   };

//   const handleNotificationClick = (event, index) => {
//     console.log("Notification clicked:", notifications[index]);
//     const updatedNotifications = [...notifications];
//     updatedNotifications.splice(index, 1);
//     handleMenuClose();
//   };

//   const handleLogout = () => {
//     // Clearing localStorage items
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('role');
//     localStorage.removeItem('first_name');
//     localStorage.removeItem('last_name');
//     localStorage.removeItem('email');
//     // Navigating to the home on logging out
//     navigate('/');
//   };

//   return (
    // <Box display="flex" justifyContent="space-between" p={2}>
    //   {/* SEARCH BAR */}
    //   <Box>
    //   </Box>

    //   {/* ICONS */}
    //   <Box display="flex">
    //     {/* <IconButton onClick={colorMode.toggleColorMode}>
    //       {theme.palette.mode === "dark" ? (
    //         <DarkModeOutlinedIcon />
    //       ) : (
    //         <LightModeOutlinedIcon />
    //       )}
    //     </IconButton> */}
    //     <IconButton onClick={handleMenuOpen}>
    //       <Badge badgeContent={notifications.length > 0 ? notifications.length : null} color="error">
    //         <NotificationsOutlinedIcon />
    //       </Badge>
    //     </IconButton>
    //     <IconButton onClick={handleUserMenuOpen}>
    //       <PersonOutlinedIcon />
    //     </IconButton>
    //   </Box>

    //   {/* Notifications Dropdown */}
    //   <Menu
    //     anchorEl={anchorEl}
    //     open={Boolean(anchorEl)}
    //     onClose={handleMenuClose}
    //     sx={{ minWidth: "240px" }}
    //   >
    //     {notifications.slice(0, 5).map((notification, index) => (
    //       <MenuItem key={index} onClick={(event) => handleNotificationClick(event, index)}>
    //         {notification.message}
    //       </MenuItem>
    //     ))}
    //     {notifications.length === 0 && (
    //       <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
    //     )}
    //   </Menu>

    //   {/* User Dropdown */}
    //   <Menu
    //     anchorEl={userAnchorEl}
    //     open={Boolean(userAnchorEl)}
    //     onClose={handleUserMenuClose}
    //     sx={{ minWidth: "240px" }}
    //   >
    //     <MenuItem>
    //       <Typography variant="body1">
    //         Email : {email}
    //       </Typography>
    //     </MenuItem>
    //     <MenuItem onClick={handleLogout}>
    //       Logout
    //     </MenuItem>
    //   </Menu>
    // </Box>
//   );
// };

// export default Topbar;











// import { Box, IconButton, Menu, MenuItem, Badge, useTheme, InputBase, Typography } from "@mui/material";
// import { useContext, useState } from "react";
// import { ColorModeContext, tokens } from "../../theme";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SearchIcon from "@mui/icons-material/Search";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// //import { Logout } from "../../logout"; // Assuming you have a Logout component

// const Topbar = ({ notifications }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const colorMode = useContext(ColorModeContext);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [userAnchorEl, setUserAnchorEl] = useState(null);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUserMenuOpen = (event) => {
//     setUserAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setUserAnchorEl(null);
//   };

//   const handleNotificationClick = (event, index) => {
//     console.log("Notification clicked:", notifications[index]);
//     const updatedNotifications = [...notifications];
//     updatedNotifications.splice(index, 1);
//     handleMenuClose();
//   };

//   return (
//     <Box display="flex" justifyContent="space-between" p={2}>
//       {/* SEARCH BAR */}
//       <Box
//         display="flex"
//         backgroundColor={colors.primary[400]}
//         borderRadius="3px"
//       >
//         <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
//         <IconButton type="button" sx={{ p: 1 }}>
//           <SearchIcon />
//         </IconButton>
//       </Box>

//       {/* ICONS */}
//       <Box display="flex">
//         <IconButton onClick={colorMode.toggleColorMode}>
//           {theme.palette.mode === "dark" ? (
//             <DarkModeOutlinedIcon />
//           ) : (
//             <LightModeOutlinedIcon />
//           )}
//         </IconButton>
//         <IconButton onClick={handleMenuOpen}>
//           <Badge badgeContent={notifications.length > 0 ? notifications.length : null} color="error">
//             <NotificationsOutlinedIcon />
//           </Badge>
//         </IconButton>
//         <IconButton>
//           <SettingsOutlinedIcon />
//         </IconButton>
//         <IconButton onClick={handleUserMenuOpen}>
//           <PersonOutlinedIcon />
//         </IconButton>
//       </Box>

//       {/* Notifications Dropdown */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         {notifications.slice(0, 5).map((notification, index) => (
//           <MenuItem key={index} onClick={(event) => handleNotificationClick(event, index)}>
//             {notification.message}
//           </MenuItem>
//         ))}
//         {notifications.length === 0 && (
//           <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
//         )}
//       </Menu>

//       {/* User Dropdown */}
//       <Menu
//         anchorEl={userAnchorEl}
//         open={Boolean(userAnchorEl)}
//         onClose={handleUserMenuClose}
//         sx={{ minWidth: "240px" }}
//       >
//         <MenuItem>
//           <Typography variant="body1">
//             User Email Address
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleUserMenuClose}>
//           Logout
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Topbar;
