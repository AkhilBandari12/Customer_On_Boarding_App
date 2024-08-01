import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';

const ClientDetailsCard = () => {
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false); // State for approval confirmation dialog
  const { clientId } = useParams();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Auto-fading of the notification after 3 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);

  useEffect(() => {
    const decryptedClientId = CryptoJS.AES.decrypt(decodeURIComponent(clientId), 'secret_key').toString(CryptoJS.enc.Utf8);
    
    // Fetch user data from API endpoint using decrypted client_id
    fetchUserData(decryptedClientId);
  }, [clientId]);

  const fetchUserData = (clientId) => {
    fetch(`http://127.0.0.1:8001/accounts/api/client-details/${clientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error('Error fetching user data:', error));
  };

  const fileViewer = (documentUrl) => {
    window.open(documentUrl, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,width=600,height=600');
  };

  const handleApprove = () => {
    setOpenApprovalDialog(true); // Open approval confirmation dialog
  };

  const handleApproveConfirmation = () => {
    axios.patch(`http://127.0.0.1:8001/accounts/api/client-details/${userData.client_id}/`, {
      is_approved: true
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      setUserData(prevUserData => ({
        ...prevUserData,
        is_approved: true
      }));
      setNotification({ type: "success", message: "Client approved successfully" });

      setTimeout(() => {
        navigate('/assignedtome');
      }, 7000);
    })
    .catch((error) => {
      console.error('Error approving client:', error);
      setNotification({ type: "error", message: "Failed to approve client" });
    })
    .finally(() => {
      setOpenApprovalDialog(false); // Close approval confirmation dialog
    });
  };

  const handleCloseApprovalDialog = () => {
    setOpenApprovalDialog(false); // Close approval confirmation dialog without approving
  };

  const isApproveButtonEnabled = () => {
    // Check if all required fields are not null or empty
    return (
      userData &&
      userData.company_name &&
      userData.country &&
      userData.city &&
      userData.address &&
      userData.employee_count &&
      userData.product &&
      userData.assigned_to &&
      userData.company_pan &&
      userData.certificate_of_incorporation_doc &&
      userData.company_address_doc
    );
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Client
      </Typography>
      {notification && (
        <Paper sx={{ padding: 2, backgroundColor: notification.type === "success" ? "#4caf50" : "#f44336", color: "#fff", marginBottom: 2 }}>
          {notification.message}
        </Paper>
      )}
      {userData && (
        <Paper sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 'bold' }} variant="h5" gutterBottom>
                {userData.first_name} {userData.last_name}
              </Typography>
              <Divider />
              <br />
              <Typography><strong>Role:</strong> {userData.role}</Typography>
              <Typography><strong>Email:</strong> {userData.email}</Typography>
              <Typography><strong>Mobile Number:</strong> {userData.mobile_number}</Typography>
              {userData.company_name && (
                <Typography><strong>Company Name:</strong> {userData.company_name}</Typography>
              )}
              {userData.country && (
                <Typography><strong>Country:</strong> {userData.country}</Typography>
              )}
              {userData.city && (
                <Typography><strong>City:</strong> {userData.city}</Typography>
              )}
              {userData.address && (
                <Typography><strong>Address:</strong> {userData.address}</Typography>
              )}
              {userData.employee_count && (
                <Typography><strong>Employee Count:</strong> {userData.employee_count}</Typography>
              )}
              {userData.product && (
                <Typography><strong>Product:</strong> {userData.product}</Typography>
              )}
            </Grid>
            {userData.role === 'Client' && (
              <Grid item xs={12} sm={6} sx={{ borderLeft: '1px solid #ddd', paddingLeft: 2 }}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h5" gutterBottom>
                    Clients Organization Details
                  </Typography>
                  <Divider />
                  <br />
                  <Typography><strong>Client ID:</strong> {userData.client_id}</Typography>
                  <Typography><strong>Assigned To:</strong> {userData.assigned_to}</Typography>
                  <Typography><strong>Is Approved:</strong> {userData.is_approved ? 'Yes' : 'No'}</Typography>
                <div>
                  <br/>
                  <Divider />
                  <div>
                  <br/>
                  {userData.company_pan_doc && (
                    <>
                      <Typography variant="h6">Company PAN Document:</Typography>
                      <Button variant="contained" onClick={() => fileViewer(userData.company_pan_doc)} size="small" sx={{ marginRight: 1 }}>
                        View
                      </Button>
                      <Button variant="contained" component="a" href={userData.company_pan_doc} target="_blank" size="small">
                        Download
                      </Button>
                    </>
                  )}
                  </div>
                  <div>
                  <br/>
                  {userData.certificate_of_incorporation_doc && (
                    <>
                      <Typography variant="h6">Certificate of Incorporation:</Typography>
                      <Button variant="contained" onClick={() => fileViewer(userData.certificate_of_incorporation_doc)} size="small" sx={{ marginRight: 1 }}>
                        View
                      </Button>
                      <Button variant="contained" component="a" href={userData.certificate_of_incorporation_doc} target="_blank" size="small">
                        Download
                      </Button>
                    </>
                  )}
                  </div>
                  <div>
                  <br/>
                  {userData.company_address_doc && (
                    <>
                      <Typography variant="h6">Company Address:</Typography>
                      <Button variant="contained" onClick={() => fileViewer(userData.company_address_doc)} size="small" sx={{ marginRight: 1 }}>
                        View
                      </Button>
                      <Button variant="contained" component="a" href={userData.company_address_doc} target="_blank" size="small">
                        Download
                      </Button>
                    </>
                  )}
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
          <br /> <br />
          {!userData.is_approved && isApproveButtonEnabled() && (
            <Button variant="contained" color="success" onClick={handleApprove}>
              Approve
              <HowToRegIcon sx={{ fontSize: "20px", marginLeft: "5px" }} />
            </Button>
          )}
        </Paper>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog
        open={openApprovalDialog}
        onClose={handleCloseApprovalDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Approval Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to approve this client?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApproveConfirmation} color="primary" autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientDetailsCard;













// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import CryptoJS from 'crypto-js';
// import axios from 'axios';
// import HowToRegIcon from '@mui/icons-material/HowToReg';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';

// const ClientDetailsCard = () => {
//   const [userData, setUserData] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const { clientId } = useParams();
//   const accessToken = localStorage.getItem('accessToken');
//   const navigate = useNavigate();
//   const [viewDocumentUrl, setViewDocumentUrl] = useState('');
//   const [openDocumentModal, setOpenDocumentModal] = useState(false);

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 3000); // Auto-fading of the notification after 3 seconds

//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [notification]);

//   useEffect(() => {
//     const decryptedClientId = CryptoJS.AES.decrypt(decodeURIComponent(clientId), 'secret_key').toString(CryptoJS.enc.Utf8);

//     // Fetch user data from API endpoint using decrypted client_id
//     fetchUserData(decryptedClientId, accessToken);
//   }, [clientId, accessToken]);

//   const fetchUserData = (clientId, accessToken) => {
//     axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${clientId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => {
//         setUserData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching user data:', error);
//         setNotification({ type: 'error', message: 'Failed to fetch user data' });
//       });
//   };

//   const handleApprove = () => {
//     if (!userData) return; // Safety check

//     axios.patch(
//       `http://127.0.0.1:8001/accounts/api/client-details/${userData.client_id}/`,
//       { is_approved: true },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     )
//       .then(() => {
//         setUserData((prevUserData) => ({
//           ...prevUserData,
//           is_approved: true,
//         }));
//         setNotification({ type: 'success', message: 'Client approved successfully' });

//         setTimeout(() => {
//           navigate('/assignedtome');
//         }, 7000);
//       })
//       .catch((error) => {
//         console.error('Error approving client:', error);
//         setNotification({ type: 'error', message: 'Failed to approve client' });
//       });
//   };

//   const openDocumentModalHandler = (documentUrl) => {
//     setViewDocumentUrl(documentUrl);
//     setOpenDocumentModal(true);
//   };

//   const closeDocumentModalHandler = () => {
//     setViewDocumentUrl('');
//     setOpenDocumentModal(false);
//   };

//   return (
//     <Container sx={{ marginTop: 4 }}>
//       <Typography variant="h3" align="center" gutterBottom>
//         Client Details
//       </Typography>
//       {notification && (
//         <Paper
//           sx={{
//             padding: 2,
//             backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
//             color: '#fff',
//             marginBottom: 2,
//           }}
//         >
//           {notification.message}
//         </Paper>
//       )}
//       {userData && (
//         <Paper sx={{ padding: 3 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography sx={{ fontWeight: 'bold' }} variant="h5" gutterBottom>
//                 {userData.first_name} {userData.last_name}
//               </Typography>
//               <Typography>
//                 <strong>Role:</strong> {userData.role}
//               </Typography>
//               <Typography>
//                 <strong>Email:</strong> {userData.email}
//               </Typography>
//               <Typography>
//                 <strong>Mobile Number:</strong> {userData.mobile_number}
//               </Typography>
//               <Typography>
//                 <strong>Company Name:</strong> {userData.company_name}
//               </Typography>
//               <Typography>
//                 <strong>Country:</strong> {userData.country}
//               </Typography>
//               <Typography>
//                 <strong>City:</strong> {userData.city}
//               </Typography>
//               <Typography>
//                 <strong>Address:</strong> {userData.address}
//               </Typography>
//               <Typography>
//                 <strong>Employee Count:</strong> {userData.employee_count}
//               </Typography>
//               <Typography>
//                 <strong>Product:</strong> {userData.product}
//               </Typography>
//             </Grid>
//             {userData.role === 'Client' && (
//               <Grid item xs={12} sm={6} sx={{ borderLeft: '1px solid #ddd', paddingLeft: 2 }}>
//                 <Paper
//                   sx={{
//                     padding: 2,
//                     background: 'linear-gradient(90deg, rgba(0,212,255,1) 9%, rgba(9,9,121,1) 90%)',
//                     border: '1px solid #ddd',
//                   }}
//                 >
//                   <Typography sx={{ fontWeight: 'bold' }} variant="h5" gutterBottom>
//                     Client's Organization Details
//                   </Typography>
//                   <Typography>
//                     <strong>Client ID:</strong> {userData.client_id}
//                   </Typography>
//                   <Typography>
//                     <strong>Assigned To:</strong> {userData.assigned_to}
//                   </Typography>
//                   <Typography>
//                     <strong>Is Approved:</strong> {userData.is_approved ? 'Yes' : 'No'}
//                   </Typography>
//                 </Paper>
//                 <div>
//                   <Typography variant="h5">Documents:</Typography>
//                   <div>
//                     <Typography variant="h6">Company PAN Document:</Typography>
//                     <Button
//                       variant="contained"
//                       onClick={() => openDocumentModalHandler(userData.company_pan_doc)}
//                       size="small"
//                       sx={{ marginRight: 1 }}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="contained"
//                       component="a"
//                       href={userData.company_pan_doc}
//                       target="_blank"
//                       size="small"
//                     >
//                       Download
//                     </Button>
//                   </div>
//                   <div>
//                     <Typography variant="h6">Certificate of Incorporation:</Typography>
//                     <Button
//                       variant="contained"
//                       onClick={() => openDocumentModalHandler(userData.certificate_of_incorporation_doc)}
//                       size="small"
//                       sx={{ marginRight: 1 }}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="contained"
//                       component="a"
//                       href={userData.certificate_of_incorporation_doc}
//                       target="_blank"
//                       size="small"
//                     >
//                       Download
//                     </Button>
//                   </div>
//                   <div>
//                     <Typography variant="h6">Company Address:</Typography>
//                     <Button
//                       variant="contained"
//                       onClick={() => openDocumentModalHandler(userData.company_address_doc)}
//                       size="small"
//                       sx={{ marginRight: 1 }}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="contained"
//                       component="a"
//                       href={userData.company_address_doc}
//                       target="_blank"
//                       size="small"
//                     >
//                       Download
//                     </Button>
//                   </div>
//                 </div>
//               </Grid>
//             )}
//           </Grid>
//           <br /> <br />
//           {!userData.is_approved && (
//             <Button variant="contained" color="success" onClick={handleApprove}>
//               Approve
//               <HowToRegIcon sx={{ fontSize: '20px' }} />
//             </Button>
//           )}
//         </Paper>
//       )}

//       {/* Document Modal */}
//       <Modal
//         open={openDocumentModal}
//         onClose={closeDocumentModalHandler}
//         aria-labelledby="document-modal-title"
//         aria-describedby="document-modal-description"
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Paper
//           elevation={3}
//           style={{
//             position: 'absolute',
//             width: '60%',
//             maxWidth: '800px',
//             backgroundColor: '#fff',
//             padding: '24px',
//             borderRadius: '8px',
//           }}
//         >
//           <Box display="flex" justifyContent="flex-end">
//             <IconButton onClick={closeDocumentModalHandler}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           {viewDocumentUrl && (
//             <div>
//               <img src={viewDocumentUrl} alt="Document Preview" style={{ maxWidth: '100%', height: 'auto' }} />
//             </div>
//           )}
//         </Paper>
//       </Modal>
//     </Container>
//   );
// };

// export default ClientDetailsCard;
































// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
// import CryptoJS from 'crypto-js'; // Import CryptoJS for decryption
// import axios from 'axios'; // Import axios for HTTP requests

// const ClientDetailsCard = () => {
//   const [userData, setUserData] = useState(null);
//   const { clientId } = useParams(); // Get encrypted client_id from URL
//   const accessToken = localStorage.getItem("accessToken");
  
//   useEffect(() => {
//     // Decrypt client_id from URL parameter
//     const decryptedClientId = CryptoJS.AES.decrypt(clientId, 'secret_key').toString(CryptoJS.enc.Utf8);
    
//     // Fetch user data from API endpoint using decrypted client_id
//     fetch(`http://127.0.0.1:8001/accounts/api/client-details/${decryptedClientId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//       .then((response) => response.json())
//       .then((data) => setUserData(data))
//       .catch((error) => console.error('Error fetching user data:', error));
//   }, []);

//   const handleApprove = () => {
//     // Patch request to approve the client
//     axios.patch(`http://127.0.0.1:8001/accounts/api/client-details/${userData.client_id}/`, {
//       is_approved: true
//     }, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then(() => {
//       // Update user data with the approved status
//       setUserData(prevUserData => ({
//         ...prevUserData,
//         is_approved: true
//       }));
//     })
//     .catch((error) => {
//       console.error('Error approving client:', error);
//     });
//   };

//   return (
//     <Container sx={{ marginTop: 4 }}>
//       <Typography variant="h3" align="center" gutterBottom>
//         Client
//       </Typography>
//       {userData && (
//         <Paper sx={{ padding: 3 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="h5" gutterBottom>
//                 {userData.first_name} {userData.last_name}
//               </Typography>
//               <Typography><strong>Role:</strong> {userData.role}</Typography>
//               <Typography><strong>Email:</strong> {userData.email}</Typography>
//               <Typography><strong>Mobile Number:</strong> {userData.mobile_number}</Typography>
//               <Typography><strong>Company Name:</strong> {userData.company_name}</Typography>
//               <Typography><strong>Country:</strong> {userData.country}</Typography>
//               <Typography><strong>City:</strong> {userData.city}</Typography>
//               <Typography><strong>Address:</strong> {userData.address}</Typography>
//               <Typography><strong>Employee Count:</strong> {userData.employee_count}</Typography>
//               <Typography><strong>Product:</strong> {userData.product}</Typography>
//             </Grid>
//             {userData.role === 'Client' && (
//               <Grid item xs={12} sm={6}>
//                 <Paper sx={{ padding: 2, background: 'linear-gradient(90deg, rgba(0,212,255,1) 9%, rgba(9,9,121,1) 90%)', border: '1px solid #ddd', borderRadius: 5 }}>
//                   <Typography variant="h5" gutterBottom>
//                     My Organization Details
//                   </Typography>
//                   {/* Add additional organization details here */}
//                   <Typography><strong>Client ID:</strong> {userData.client_id}</Typography>
//                   <Typography><strong>Assigned To:</strong> {userData.assigned_to}</Typography>
//                   <Typography><strong>Is Approved:</strong> {userData.is_approved ? 'Yes' : 'No'}</Typography>
//                   {/* Add more organization details as needed */}
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>
//           <br /> <br />
//           {!userData.is_approved && (
//             <Button variant="contained" color="primary" onClick={handleApprove}>
//               Approve
//             </Button>
//           )}
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default ClientDetailsCard;
