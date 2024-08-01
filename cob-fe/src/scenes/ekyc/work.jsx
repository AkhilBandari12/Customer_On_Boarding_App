import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';

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

const EKYCForm = () => {
  const theme = useTheme();
  const accessToken = localStorage.getItem("accessToken");
  const user_id = localStorage.getItem("user_id");
  const [formData, setFormData] = useState({
    company_pan: '',
    company_pan_doc: null,
    certificate_of_incorporation_doc: null,
    company_address_doc: null,
    gstin: '',
  });
  const [editable, setEditable] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
    fetchData();
  }, [accessToken, user_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setFormData({ ...formData, [fieldName]: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    try {
      const response = await axios.patch(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, formDataToSend,  {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
      const data = await response.json();
      console.log('Data submitted successfully:', data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const toggleEdit = () => {
    if (!isApproved) {
      setEditable(!editable);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
      <Paper elevation={3} style={{ padding: theme.spacing(4), borderRadius: theme.spacing(1), position: 'relative' }}>
        <Typography variant="h5" align="center" gutterBottom>
          E-KYC Form
        </Typography>
        <Divider />
        <br /><br />
        {!isApproved && (
          <Button onClick={toggleEdit} style={{ backgroundColor:"#3A3F51", color:"white", position: 'absolute', top: theme.spacing(1), right: theme.spacing(1) }}>
            {editable ? 'Cancel' : 'Edit'}
          </Button>
        )}
        {isApproved && (
          <Typography variant="body1" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px', borderRadius: '4px', position: 'absolute', top: theme.spacing(1), right: theme.spacing(1) }}>
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
                required
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
                required
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
                  required
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Company PAN Document</Typography>
                  <StyledInput
                    type="file"
                    name="company_pan_doc"
                    onChange={(e) => handleFileChange(e, 'company_pan_doc')}
                    required
                    disabled={!editable}
                  />
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
                  required
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Certificate of Incorporation Document</Typography>
                  <StyledInput
                    type="file"
                    name="certificate_of_incorporation_doc"
                    onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
                    required
                    disabled={!editable}
                  />
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
                  required
                  disabled={!editable}
                />
              )}
              {editable && (
                <>
                  <Typography variant="body1">Company Address Document</Typography>
                  <StyledInput
                    fullWidth
                    type="file"
                    name="company_address_doc"
                    onChange={(e) => handleFileChange(e, 'company_address_doc')}
                    required
                    disabled={!editable}
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} style={{marginTop: theme.spacing(2)}}>
              {editable && (
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={!editable}>
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EKYCForm;


































// import React, { useState } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { styled, useTheme } from '@mui/material/styles';
// import axios from 'axios';

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
//   const accessToken = localStorage.getItem("accessToken");
//   const user_id = localStorage.getItem("user_id");
//   const [formData, setFormData] = useState({
//     company_pan: '',
//     company_pan_doc: null,
//     certificate_of_incorporation_doc: null,
//     company_address_doc: null,
//     gstin: '',
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (event, fieldName) => {
//     const file = event.target.files[0];
//     setFormData({ ...formData, [fieldName]: file });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formDataToSend = new FormData();
//     for (const key in formData) {
//       formDataToSend.append(key, formData[key]);
//     }
//     try {
//       const response = await axios.patch(`http://127.0.0.1:8001/accounts/api/client-details/${user_id}/`, formDataToSend,  {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Failed to submit data');
//       }
//       const data = await response.json();
//       console.log('Data submitted successfully:', data);
//     } catch (error) {
//       console.error('Error submitting data:', error);
//     }
//   };

//   return (
//     <Container maxWidth="md" style={{ marginTop: theme.spacing(2) }}>
//       <Paper elevation={3} style={{ padding: theme.spacing(4), borderRadius: theme.spacing(1) }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           eKYC Form
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Company PAN"
//                 name="company_pan"
//                 value={formData.company_pan}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="GSTIN"
//                 name="gstin"
//                 value={formData.gstin}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1">Certificate of Incorporation Document</Typography>
//               <StyledInput
//                 type="file"
//                 name="company_pan_doc"
//                 onChange={(e) => handleFileChange(e, 'company_pan_doc')}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1">Certificate of Incorporation Document</Typography>
//               <StyledInput
//                 type="file"
//                 name="certificate_of_incorporation_doc"
//                 onChange={(e) => handleFileChange(e, 'certificate_of_incorporation_doc')}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1">Company Address Document</Typography>
//               <StyledInput
//                 fullWidth
//                 type="file"
//                 name="company_address_doc"
//                 onChange={(e) => handleFileChange(e, 'company_address_doc')}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" color="primary" fullWidth>
//                 Submit
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default EKYCForm;

