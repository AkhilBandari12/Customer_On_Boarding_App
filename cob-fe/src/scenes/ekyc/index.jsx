import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import { Box, IconButton, Alert } from '@mui/material';

const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '8px',
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: '4px',
  fontSize: '16px',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

const EKYCForm = ({ setNotifications }) => {
  const theme = useTheme();
  const accessToken = localStorage.getItem('accessToken');
  const user_id = localStorage.getItem('user_id');

  const [notification, setNotification] = useState(null); // State for notifications

  ///FILE_VALUDATIONS
  const FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text',];
  const MIN_FILE_SIZE = 200 * 1024; // 200KB in bytes
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const [formData, setFormData] = useState({
    company_pan: '',
    company_pan_doc: null,
    certificate_of_incorporation_doc: null,
    company_address_doc: null,
    gstin: '',
  });

  const [editable, setEditable] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    company_pan_doc: null,
    certificate_of_incorporation_doc: null,
    company_address_doc: null,
  });

  const [fileErrors, setFileErrors] = useState({
    company_pan_doc: '',
    certificate_of_incorporation_doc: '',
    company_address_doc: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const responseData = response.data;
        if (responseData) {
          setFormData({
            company_pan: responseData.company_pan || '',
            company_pan_doc: responseData.company_pan_doc || null,
            certificate_of_incorporation_doc: responseData.certificate_of_incorporation_doc || null,
            company_address_doc: responseData.company_address_doc || null,
            gstin: responseData.gstin || '',
          });
          setIsApproved(responseData.is_approved || false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (accessToken && user_id) {
      fetchData();
    }
  }, [accessToken, user_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];

    if (validateFile(file, fieldName)) {
      setSelectedFiles({ ...selectedFiles, [fieldName]: file });
      setFileErrors({ ...fileErrors, [fieldName]: '' });
    } else {
      event.target.value = null;
      setSelectedFiles({ ...selectedFiles, [fieldName]: null });
    }
  };

  const validateFile = (file, fieldName) => {
    if (!file) {
      return false;
    }

    if (!FILE_TYPES.includes(file.type)) {
      setFileErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: `File type not supported for ${fieldName}. Please upload one of: .jpeg, .jpg, .png, .pdf, .docx, .doc, .odt`,
      }));
      return false;
    }

    if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
      setFileErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: `File size should be between 200KB and 5MB for ${fieldName}.`,
      }));
      return false;
    }

    return true;
  };

  const fileViewer = (documentUrl) => {
    window.open(documentUrl, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,width=900,height=900');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append('company_pan', formData.company_pan);
    formDataToSend.append('gstin', formData.gstin);

    if (selectedFiles.company_pan_doc) {
      formDataToSend.append('company_pan_doc', selectedFiles.company_pan_doc);
    }
    if (selectedFiles.certificate_of_incorporation_doc) {
      formDataToSend.append('certificate_of_incorporation_doc', selectedFiles.certificate_of_incorporation_doc);
    }
    if (selectedFiles.company_address_doc) {
      formDataToSend.append('company_address_doc', selectedFiles.company_address_doc);
    }

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        const newNotification = {
          type: 'success',
          message: 'Submitted Successfully',
        };
        setNotification(newNotification); // Set success notification
        if (setNotifications) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification,
          ]);
        }
        setTimeout(() => {
          setNotification(null); // Clear notification after 5 seconds
        }, 5000);
        setEditable(editable);
        console.log('Data submitted successfully:', responseData);
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (error) {
      const newNotification = {
        type: 'error',
        message: 'Failed to submit. Please try again later.',
      };
      setNotification(newNotification); // Set error notification
      if (setNotifications) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      }
      setTimeout(() => {
        setNotification(null); // Clear notification after 5 seconds
      }, 5000);
      console.error('Error submitting data:', error);
    }
  };

  const toggleEdit = () => {
    if (!isApproved) {
      setEditable(!editable);
    }
  };

  const isRequiredField = (fieldName) => {
    const fieldValue = formData[fieldName];
    return fieldValue === null || fieldValue === undefined || fieldValue === '';
  };

  const validateCompanyPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/;
    return gstinRegex.test(gstin);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
      <Paper
        elevation={3}
        style={{
          padding: theme.spacing(4),
          borderRadius: theme.spacing(1),
          position: 'relative',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          E-KYC Form
        </Typography>
        <Divider />
        <br />
        <br />
        {!isApproved && (
          <Button
            onClick={toggleEdit}
            style={{
              backgroundColor: '#3A3F51',
              color: 'white',
              position: 'absolute',
              top: theme.spacing(1),
              right: theme.spacing(1),
            }}
          >
            {editable ? 'Cancel' : 'Edit'}
          </Button>
        )}
        {isApproved && (
          <Typography
            variant="body1"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              position: 'absolute',
              top: theme.spacing(1),
              right: theme.spacing(1),
            }}
          >
            E-KYC Verified <CheckIcon style={{ marginLeft: '8px' }} />
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company PAN"
                name="company_pan"
                value={formData.company_pan}
                onChange={handleChange}
                required={isRequiredField('company_pan')}
                error={!validateCompanyPAN(formData.company_pan)}
                helperText={!validateCompanyPAN(formData.company_pan) ? 'Invalid PAN format' : ''}
                disabled={!editable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                required={isRequiredField('gstin')}
                error={!validateGSTIN(formData.gstin)}
                helperText={!validateGSTIN(formData.gstin) ? 'Invalid GSTIN format' : ''}
                disabled={!editable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {!editable && (
                <TextField
                  fullWidth
                  label="Company Pan Document"
                  name="company_pan_doc"
                  value={formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : ''}
                  onChange={handleChange}
                  required={isRequiredField('company_pan_doc')}
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Company PAN Document</Typography>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <StyledInput
                      type="file"
                      name="company_pan_doc"
                      onChange={(e) => handleFileChange(e, 'company_pan_doc')}
                      required={isRequiredField('company_pan_doc')}
                      disabled={!editable}
                      sx={{ marginRight: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
                  </Typography>
                  {formData.company_pan_doc && (
                    <Box display="flex" alignItems="center">
                      <Typography>
                        <strong>Previous Upload: </strong>
                        {formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : 'No file uploaded'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => fileViewer(formData.company_pan_doc)}
                        sx={{ marginLeft: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  {fileErrors.company_pan_doc && (
                    <Alert severity="error" sx={{ marginTop: '8px' }}>
                      {fileErrors.company_pan_doc}
                    </Alert>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {!editable && (
                <TextField
                  fullWidth
                  label="Certificate of Incorporation Document"
                  name="certificate_of_incorporation_doc"
                  value={formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : ''}
                  onChange={handleChange}
                  required={isRequiredField('certificate_of_incorporation_doc')}
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Certificate of Incorporation Document</Typography>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <StyledInput
                      type="file"
                      name="certificate_of_incorporation_doc"
                      onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
                      required={isRequiredField('certificate_of_incorporation_doc')}
                      disabled={!editable}
                      sx={{ marginRight: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
                  </Typography>
                  {formData.certificate_of_incorporation_doc && (
                    <Box display="flex" alignItems="center">
                      <Typography>
                        <strong>Previous Upload: </strong>
                        {formData.company_pan_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : 'No file uploaded'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => fileViewer(formData.certificate_of_incorporation_doc)}
                        sx={{ marginLeft: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  {fileErrors.certificate_of_incorporation_doc && (
                    <Alert severity="error" sx={{ marginTop: '8px' }}>
                      {fileErrors.certificate_of_incorporation_doc}
                    </Alert>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {!editable && (
                <TextField
                  fullWidth
                  label="Company Address Document"
                  name="company_address_doc"
                  value={formData.company_address_doc ? formData.company_address_doc.split('/').pop() : ''}
                  onChange={handleChange}
                  required={isRequiredField('company_address_doc')}
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Company Address Document</Typography>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <StyledInput
                      type="file"
                      name="company_address_doc"
                      onChange={(e) => handleFileChange(e, 'company_address_doc')}
                      required={isRequiredField('company_address_doc')}
                      disabled={!editable}
                      sx={{ marginRight: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
                  </Typography>
                  {formData.company_address_doc && (
                    <Box display="flex" alignItems="center">
                      <Typography>
                        <strong>Previous Upload: </strong>
                        {formData.company_pan_doc ? formData.company_address_doc.split('/').pop() : 'No file uploaded'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => fileViewer(formData.company_address_doc)}
                        sx={{ marginLeft: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  {fileErrors.company_address_doc && (
                    <Alert severity="error" sx={{ marginTop: '8px' }}>
                      {fileErrors.company_address_doc}
                    </Alert>
                  )}
                </>
              )}
            </Grid>
            {!isApproved && editable && (
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            )}
          </Grid>
        </form>

        {/* Notification Component */}
        {notification && (
          <Alert severity={notification.type} sx={{ marginTop: '16px' }}>
            {notification.message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default EKYCForm;






















// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { styled, useTheme } from '@mui/material/styles';
// import axios from 'axios';
// import { Box, IconButton, Alert } from '@mui/material';

// const StyledInput = styled('input')(({ theme }) => ({
//   width: '100%',
//   padding: '8px',
//   border: `1px solid ${theme.palette.text.primary}`,
//   borderRadius: '4px',
//   fontSize: '16px',
//   boxSizing: 'border-box',
//   '&:focus': {
//     outline: 'none',
//     borderColor: theme.palette.primary.main,
//   },
//   '&::placeholder': {
//     color: theme.palette.text.secondary,
//   },
// }));

// const EKYCForm = ({ setNotifications }) => {
//   const theme = useTheme();
//   const accessToken = localStorage.getItem('accessToken');
//   const user_id = localStorage.getItem('user_id');
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     company_pan: '',
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//     gstin: '',
//   });

//   const [editable, setEditable] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState({
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//   });

  // // File type and size validation constants
  // const FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text',];
  // const MIN_FILE_SIZE = 200 * 1024; // 200KB in bytes
  // const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

//   // State to manage file validation errors
//   const [fileErrors, setFileErrors] = useState({
//     company_pan_doc: '',
//     certificate_of_incorporation_doc: '',
//     company_address_doc: '',
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         const responseData = response.data;
//         if (responseData) {
//           setFormData({
//             company_pan: responseData.company_pan || '',
//             company_pan_doc: responseData.company_pan_doc || null,
//             certificate_of_incorporation_doc: responseData.certificate_of_incorporation_doc || null,
//             company_address_doc: responseData.company_address_doc || null,
//             gstin: responseData.gstin || '',
//           });
//           setIsApproved(responseData.is_approved || false);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     if (accessToken && user_id) {
//       fetchData();
//     }
//   }, [accessToken, user_id]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (event, fieldName) => {
//     const file = event.target.files[0];

//     // Validate file
//     if (validateFile(file, fieldName)) {
//       setSelectedFiles({ ...selectedFiles, [fieldName]: file });
//       // Clear any previous error message for this field
//       setFileErrors({ ...fileErrors, [fieldName]: '' });
//     } else {
//       // Clear the file input if validation fails
//       event.target.value = null;
//       setSelectedFiles({ ...selectedFiles, [fieldName]: null });
//     }
//   };

//   const validateFile = (file, fieldName) => {
//     if (!file) {
//       return false;
//     }

//     // Check file type
//     if (!FILE_TYPES.includes(file.type)) {
//       setFileErrors(prevErrors => ({
//         ...prevErrors,
//         [fieldName]: `File type not supported for ${fieldName}. Please upload one of: .jpeg, .jpg, .png, .pdf, .docx, .doc, .odt`,
//       }));
//       return false;
//     }

//     // Check file size
//     if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
//       setFileErrors(prevErrors => ({
//         ...prevErrors,
//         [fieldName]: `File size should be between 200KB and 5MB for ${fieldName}.`,
//       }));
//       return false;
//     }

//     return true;
//   };

//   const fileViewer = (documentUrl) => {
//     window.open(documentUrl, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,width=900,height=900');
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formDataToSend = new FormData();

//     formDataToSend.append('company_pan', formData.company_pan);
//     formDataToSend.append('gstin', formData.gstin);

//     if (selectedFiles.company_pan_doc) {
//       formDataToSend.append('company_pan_doc', selectedFiles.company_pan_doc);
//     }
//     if (selectedFiles.certificate_of_incorporation_doc) {
//       formDataToSend.append('certificate_of_incorporation_doc', selectedFiles.certificate_of_incorporation_doc);
//     }
//     if (selectedFiles.company_address_doc) {
//       formDataToSend.append('company_address_doc', selectedFiles.company_address_doc);
//     }

//     try {
//       const response = await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.status === 200) {
//         const responseData = response.data;
//         const newNotification = {
//           type: 'success',
//           message: 'Submitted Successfully',
//         };
//         console.log('Data submitted successfully:', responseData);
//         // Optionally, update state or show success message
//       } else {
//         throw new Error('Failed to submit data');
//       }
//     } catch (error) {
//       console.error('Error submitting data:', error);
//       // Handle error, show error message or notification
//     }
//   };

//   const toggleEdit = () => {
//     if (!isApproved) {
//       setEditable(!editable);
//     }
//   };

//   const isRequiredField = (fieldName) => {
//     const fieldValue = formData[fieldName];
//     return fieldValue === null || fieldValue === undefined || fieldValue === '';
//   };

//   const validateCompanyPAN = (pan) => {
//     // Regex pattern for Company PAN (example: AAAAA1234A)
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     return panRegex.test(pan);
//   };

//   const validateGSTIN = (gstin) => {
//     // Regex pattern for GSTIN (example: 22AAAAA0000A1Z5)
//     const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/;
//     return gstinRegex.test(gstin);
//   };


//   return (
//     <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
//       <Paper
//         elevation={3}
//         style={{
//           padding: theme.spacing(4),
//           borderRadius: theme.spacing(1),
//           position: 'relative',
//         }}
//       >
//         <Typography variant="h5" align="center" gutterBottom>
//           E-KYC Form
//         </Typography>
//         <Divider />
//         <br />
//         <br />
//         {!isApproved && (
//           <Button
//             onClick={toggleEdit}
//             style={{
//               backgroundColor: '#3A3F51',
//               color: 'white',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             {editable ? 'Cancel' : 'Edit'}
//           </Button>
//         )}
//         {isApproved && (
//           <Typography
//             variant="body1"
//             style={{
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               padding: '8px',
//               borderRadius: '4px',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             E-KYC Verified <CheckIcon style={{ marginLeft: '8px' }} />
//           </Typography>
//         )}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Company PAN"
//                 name="company_pan"
//                 value={formData.company_pan}
//                 onChange={handleChange}
//                 required={isRequiredField('company_pan')}
//                 error={!validateCompanyPAN(formData.company_pan)}
//                 helperText={!validateCompanyPAN(formData.company_pan) ? 'Invalid PAN format' : ''}
//                 disabled={!editable}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="GSTIN"
//                 name="gstin"
//                 value={formData.gstin}
//                 onChange={handleChange}
//                 required={isRequiredField('gstin')}
//                 error={!validateGSTIN(formData.gstin)}
//                 helperText={!validateGSTIN(formData.gstin) ? 'Invalid GSTIN format' : ''}
//                 disabled={!editable}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Pan Document"
//                   name="company_pan_doc"
//                   value={formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_pan_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company PAN Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_pan_doc"
//                       onChange={(e) => handleFileChange(e, 'company_pan_doc')}
//                       required={isRequiredField('company_pan_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   <Typography variant="body2" color="textSecondary">
//                     Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
//                   </Typography>
//                   {formData.company_pan_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_pan_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                   {fileErrors.company_pan_doc && (
//                     <Alert severity="error" sx={{ marginTop: '8px' }}>
//                       {fileErrors.company_pan_doc}
//                     </Alert>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Certificate of Incorporation Document"
//                   name="certificate_of_incorporation_doc"
//                   value={formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('certificate_of_incorporation_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Certificate of Incorporation Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="certificate_of_incorporation_doc"
//                       onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
//                       required={isRequiredField('certificate_of_incorporation_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   <Typography variant="body2" color="textSecondary">
//                     Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
//                   </Typography>
//                   {formData.certificate_of_incorporation_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_pan_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.certificate_of_incorporation_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                   {fileErrors.certificate_of_incorporation_doc && (
//                     <Alert severity="error" sx={{ marginTop: '8px' }}>
//                       {fileErrors.certificate_of_incorporation_doc}
//                     </Alert>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Address Document"
//                   name="company_address_doc"
//                   value={formData.company_address_doc ? formData.company_address_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_address_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company Address Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_address_doc"
//                       onChange={(e) => handleFileChange(e, 'company_address_doc')}
//                       required={isRequiredField('company_address_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   <Typography variant="body2" color="textSecondary">
//                     Supported file types: JPEG, JPG, PNG, PDF, DOC, DOCX, ODT. Min Size: 200KB Max size: 5MB
//                   </Typography>
//                   {formData.company_address_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_pan_doc ? formData.company_address_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_address_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                   {fileErrors.company_address_doc && (
//                     <Alert severity="error" sx={{ marginTop: '8px' }}>
//                       {fileErrors.company_address_doc}
//                     </Alert>
//                   )}
//                 </>
//               )}
//             </Grid>
//             {!isApproved && editable && (
//               <Grid item xs={12}>
//                 <Button type="submit" variant="contained" color="primary" fullWidth>
//                   Submit
//                 </Button>
//               </Grid>
//             )}
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default EKYCForm;






//////////////////with - PAN and GSTIN Validations
// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { styled, useTheme } from '@mui/material/styles';
// import axios from 'axios';
// import { Box, IconButton } from '@mui/material';

// const StyledInput = styled('input')(({ theme }) => ({
//   width: '100%',
//   padding: '8px',
//   border: `1px solid ${theme.palette.text.primary}`,
//   borderRadius: '4px',
//   fontSize: '16px',
//   boxSizing: 'border-box',
//   '&:focus': {
//     outline: 'none',
//     borderColor: theme.palette.primary.main,
//   },
//   '&::placeholder': {
//     color: theme.palette.text.secondary,
//   },
// }));

// const EKYCForm = () => {
//   const theme = useTheme();
//   const accessToken = localStorage.getItem('accessToken');
//   const user_id = localStorage.getItem('user_id');

//   const [formData, setFormData] = useState({
//     company_pan: '',
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//     gstin: '',
//   });

//   const [editable, setEditable] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState({
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         const responseData = response.data;
//         if (responseData) {
//           setFormData({
//             company_pan: responseData.company_pan || '',
//             company_pan_doc: responseData.company_pan_doc || null,
//             certificate_of_incorporation_doc: responseData.certificate_of_incorporation_doc || null,
//             company_address_doc: responseData.company_address_doc || null,
//             gstin: responseData.gstin || '',
//           });
//           setIsApproved(responseData.is_approved || false);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     if (accessToken && user_id) {
//       fetchData();
//     }
//   }, [accessToken, user_id]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (event, fieldName) => {
//     const file = event.target.files[0];
//     setSelectedFiles({ ...selectedFiles, [fieldName]: file });
//   };

//   const fileViewer = (documentUrl) => {
//     window.open(documentUrl, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,width=900,height=900');
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formDataToSend = new FormData();

//     formDataToSend.append('company_pan', formData.company_pan);
//     formDataToSend.append('gstin', formData.gstin);

//     if (selectedFiles.company_pan_doc) {
//       formDataToSend.append('company_pan_doc', selectedFiles.company_pan_doc);
//     }
//     if (selectedFiles.certificate_of_incorporation_doc) {
//       formDataToSend.append('certificate_of_incorporation_doc', selectedFiles.certificate_of_incorporation_doc);
//     }
//     if (selectedFiles.company_address_doc) {
//       formDataToSend.append('company_address_doc', selectedFiles.company_address_doc);
//     }

//     try {
//       const response = await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.status === 200) {
//         const responseData = response.data;
//         console.log('Data submitted successfully:', responseData);
//         // Optionally, update state or show success message
//       } else {
//         throw new Error('Failed to submit data');
//       }
//     } catch (error) {
//       console.error('Error submitting data:', error);
//       // Handle error, show error message or notification
//     }
//   };

//   const toggleEdit = () => {
//     if (!isApproved) {
//       setEditable(!editable);
//     }
//   };

//   const isRequiredField = (fieldName) => {
//     const fieldValue = formData[fieldName];
//     return fieldValue === null || fieldValue === undefined || fieldValue === '';
//   };

  // const validateCompanyPAN = (pan) => {
  //   // Regex pattern for Company PAN (example: AAAAA1234A)
  //   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //   return panRegex.test(pan);
  // };

  // const validateGSTIN = (gstin) => {
  //   // Regex pattern for GSTIN (example: 22AAAAA0000A1Z5)
  //   const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/;
  //   return gstinRegex.test(gstin);
  // };

//   return (
//     <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
//       <Paper
//         elevation={3}
//         style={{
//           padding: theme.spacing(4),
//           borderRadius: theme.spacing(1),
//           position: 'relative',
//         }}
//       >
//         <Typography variant="h5" align="center" gutterBottom>
//           E-KYC Form
//         </Typography>
//         <Divider />
//         <br />
//         <br />
//         {!isApproved && (
//           <Button
//             onClick={toggleEdit}
//             style={{
//               backgroundColor: '#3A3F51',
//               color: 'white',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             {editable ? 'Cancel' : 'Edit'}
//           </Button>
//         )}
//         {isApproved && (
//           <Typography
//             variant="body1"
//             style={{
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               padding: '8px',
//               borderRadius: '4px',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             E-KYC Verified <CheckIcon style={{ marginLeft: '8px' }} />
//           </Typography>
//         )}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
            // <Grid item xs={12} sm={6}>
            //   <TextField
            //     fullWidth
            //     label="Company PAN"
            //     name="company_pan"
            //     value={formData.company_pan}
            //     onChange={handleChange}
            //     required={isRequiredField('company_pan')}
            //     error={!validateCompanyPAN(formData.company_pan)}
            //     helperText={!validateCompanyPAN(formData.company_pan) ? 'Invalid PAN format' : ''}
            //     disabled={!editable}
            //   />
            // </Grid>
            // <Grid item xs={12} sm={6}>
            //   <TextField
            //     fullWidth
            //     label="GSTIN"
            //     name="gstin"
            //     value={formData.gstin}
            //     onChange={handleChange}
            //     required={isRequiredField('gstin')}
            //     error={!validateGSTIN(formData.gstin)}
            //     helperText={!validateGSTIN(formData.gstin) ? 'Invalid GSTIN format' : ''}
            //     disabled={!editable}
            //   />
            // </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Pan Document"
//                   name="company_pan_doc"
//                   value={formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_pan_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company PAN Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_pan_doc"
//                       onChange={(e) => handleFileChange(e, 'company_pan_doc')}
//                       required={isRequiredField('company_pan_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.company_pan_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_pan_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Certificate of Incorporation Document"
//                   name="certificate_of_incorporation_doc"
//                   value={formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('certificate_of_incorporation_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Certificate of Incorporation Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="certificate_of_incorporation_doc"
//                       onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
//                       required={isRequiredField('certificate_of_incorporation_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.certificate_of_incorporation_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.certificate_of_incorporation_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Address Document"
//                   name="company_address_doc"
//                   value={formData.company_address_doc ? formData.company_address_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_address_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company Address Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_address_doc"
//                       onChange={(e) => handleFileChange(e, 'company_address_doc')}
//                       required={isRequiredField('company_address_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.company_address_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_address_doc ? formData.company_address_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_address_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//           </Grid>
//           {!isApproved && editable && (
//             <Grid item xs={12} style={{ marginTop: theme.spacing(2) }}>
//             {editable && (
//                 <Button type="submit" variant="contained" color="primary" fullWidth disabled={!editable}>
//                   Submit
//                 </Button>
//             )}
//             </Grid>
//           )}
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default EKYCForm;
























// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { styled, useTheme } from '@mui/material/styles';
// import axios from 'axios';
// import { Box, IconButton } from '@mui/material';

// const StyledInput = styled('input')(({ theme }) => ({
//   width: '100%',
//   padding: '8px',
//   border: `1px solid ${theme.palette.text.primary}`,
//   borderRadius: '4px',
//   fontSize: '16px',
//   boxSizing: 'border-box',
//   '&:focus': {
//     outline: 'none',
//     borderColor: theme.palette.primary.main,
//   },
//   '&::placeholder': {
//     color: theme.palette.text.secondary,
//   },
// }));

// const EKYCForm = () => {
//   const theme = useTheme();
//   const accessToken = localStorage.getItem('accessToken');
//   const user_id = localStorage.getItem('user_id');

//   const [formData, setFormData] = useState({
//     company_pan: '',
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//     gstin: '',
//   });

//   const [editable, setEditable] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState({
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         const responseData = response.data;
//         if (responseData) {
//           setFormData({
//             company_pan: responseData.company_pan || '',
//             company_pan_doc: responseData.company_pan_doc || null,
//             certificate_of_incorporation_doc: responseData.certificate_of_incorporation_doc || null,
//             company_address_doc: responseData.company_address_doc || null,
//             gstin: responseData.gstin || '',
//           });
//           setIsApproved(responseData.is_approved || false);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     if (accessToken && user_id) {
//       fetchData();
//     }
//   }, [accessToken, user_id]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (event, fieldName) => {
//     const file = event.target.files[0];
//     setSelectedFiles({ ...selectedFiles, [fieldName]: file });
//   };

//   const fileViewer = (documentUrl) => {
//     window.open(documentUrl, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,width=900,height=900');
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formDataToSend = new FormData();

//     formDataToSend.append('company_pan', formData.company_pan);
//     formDataToSend.append('gstin', formData.gstin);

//     if (selectedFiles.company_pan_doc) {
//       formDataToSend.append('company_pan_doc', selectedFiles.company_pan_doc);
//     }
//     if (selectedFiles.certificate_of_incorporation_doc) {
//       formDataToSend.append('certificate_of_incorporation_doc', selectedFiles.certificate_of_incorporation_doc);
//     }
//     if (selectedFiles.company_address_doc) {
//       formDataToSend.append('company_address_doc', selectedFiles.company_address_doc);
//     }

//     try {
//       const response = await axios.patch(
//         `http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.status === 200) {
//         const responseData = response.data;
//         console.log('Data submitted successfully:', responseData);
//         // Optionally, update state or show success message
//       } else {
//         throw new Error('Failed to submit data');
//       }
//     } catch (error) {
//       console.error('Error submitting data:', error);
//       // Handle error, show error message or notification
//     }
//   };

//   const toggleEdit = () => {
//     if (!isApproved) {
//       setEditable(!editable);
//     }
//   };

//   const isRequiredField = (fieldName) => {
//     const fieldValue = formData[fieldName];
//     return fieldValue === null || fieldValue === undefined || fieldValue === '';
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
//       <Paper
//         elevation={3}
//         style={{
//           padding: theme.spacing(4),
//           borderRadius: theme.spacing(1),
//           position: 'relative',
//         }}
//       >
//         <Typography variant="h5" align="center" gutterBottom>
//           E-KYC Form
//         </Typography>
//         <Divider />
//         <br />
//         <br />
//         {!isApproved && (
//           <Button
//             onClick={toggleEdit}
//             style={{
//               backgroundColor: '#3A3F51',
//               color: 'white',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             {editable ? 'Cancel' : 'Edit'}
//           </Button>
//         )}
//         {isApproved && (
//           <Typography
//             variant="body1"
//             style={{
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               padding: '8px',
//               borderRadius: '4px',
//               position: 'absolute',
//               top: theme.spacing(1),
//               right: theme.spacing(1),
//             }}
//           >
//             E-KYC Verified <CheckIcon style={{ marginLeft: '8px' }} />
//           </Typography>
//         )}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Company PAN"
//                 name="company_pan"
//                 value={formData.company_pan}
//                 onChange={handleChange}
//                 required={isRequiredField('company_pan')}
//                 disabled={!editable}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="GSTIN"
//                 name="gstin"
//                 value={formData.gstin}
//                 onChange={handleChange}
//                 required={isRequiredField('gstin')}
//                 disabled={!editable}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Pan Document"
//                   name="company_pan_doc"
//                   value={formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_pan_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company PAN Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_pan_doc"
//                       onChange={(e) => handleFileChange(e, 'company_pan_doc')}
//                       required={isRequiredField('company_pan_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.company_pan_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_pan_doc ? formData.company_pan_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_pan_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Certificate of Incorporation Document"
//                   name="certificate_of_incorporation_doc"
//                   value={formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('certificate_of_incorporation_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Certificate of Incorporation Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="certificate_of_incorporation_doc"
//                       onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
//                       required={isRequiredField('certificate_of_incorporation_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.certificate_of_incorporation_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.certificate_of_incorporation_doc ? formData.certificate_of_incorporation_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.certificate_of_incorporation_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {!editable && (
//                 <TextField
//                   fullWidth
//                   label="Company Address Document"
//                   name="company_address_doc"
//                   value={formData.company_address_doc ? formData.company_address_doc.split('/').pop() : ''}
//                   onChange={handleChange}
//                   required={isRequiredField('company_address_doc')}
//                   disabled={!editable}
//                 />
//               )}
//               {editable && (
//                 <>
//                   <Typography variant="body1">Company Address Document</Typography>
//                   <Box display="flex" alignItems="center" marginBottom={1}>
//                     <StyledInput
//                       type="file"
//                       name="company_address_doc"
//                       onChange={(e) => handleFileChange(e, 'company_address_doc')}
//                       required={isRequiredField('company_address_doc')}
//                       disabled={!editable}
//                       sx={{ marginRight: 1 }}
//                     />
//                   </Box>
//                   {formData.company_address_doc && (
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         <strong>Previous Upload: </strong>
//                         {formData.company_address_doc ? formData.company_address_doc.split('/').pop() : 'No file uploaded'}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={() => fileViewer(formData.company_address_doc)}
//                         sx={{ marginLeft: 1 }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </Grid>
//           </Grid>
//           {!isApproved && editable && (
          // <Grid item xs={12} style={{ marginTop: theme.spacing(2) }}>
          // {editable && (
          //     <Button type="submit" variant="contained" color="primary" fullWidth disabled={!editable}>
          //       Submit
          //     </Button>
          // )}
          // </Grid>
//           )}
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default EKYCForm;
