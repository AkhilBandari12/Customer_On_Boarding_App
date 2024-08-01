import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_description: '',
    period: '',
    price: '',
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const [modalButtonText, setModalButtonText] = useState('Add Plan');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // Track delete confirmation
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    fetch('http://127.0.0.1:8001/accounts/api/plans/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setPlans(data.plans))
      .catch((error) => console.error('Error fetching plans:', error));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setFormData({
      plan_name: '',
      plan_description: '',
      period: '',
      price: '',
    });
    setSelectedPlanId(null);
    setModalButtonText('Add Plan');
    setFormError('');
    setFormSuccess('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!formData.plan_name || !formData.period || !formData.price) {
      setFormError('Please fill out all required fields.');
      setFormSuccess('');
      return;
    }
    if (selectedPlanId) {
      axios.patch(`http://127.0.0.1:8001/accounts/api/update-plan/${selectedPlanId}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        handleCloseModal();
        fetchPlans();
        setFormError('');
        setFormSuccess('Plan updated successfully.');
      })
      .catch((error) => {
        setFormError('Error updating plan.');
        setFormSuccess('');
        console.error('Error updating plan:', error);
      });
    } else {
      axios.post('http://127.0.0.1:8001/accounts/api/plans/', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        handleCloseModal();
        fetchPlans();
        setFormError('');
        setFormSuccess('Plan added successfully.');
      })
      .catch((error) => {
        setFormError('Error adding plan.');
        setFormSuccess('');
        console.error('Error adding plan:', error);
      });
    }
  };

  const handleUpdatePlan = (plan) => {
    setSelectedPlanId(plan.id);
    setFormData({
      plan_name: plan.plan_name,
      plan_description: plan.plan_description,
      period: plan.period,
      price: plan.price,
    });
    setOpenModal(true);
    setModalButtonText('Update Plan');
    setFormError('');
    setFormSuccess('');
  };

  const handleDeletePlan = (planId) => {
    setSelectedPlanId(planId);
    setDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://127.0.0.1:8001/accounts/api/update-plan/${selectedPlanId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      fetchPlans();
      setFormSuccess('Plan deleted successfully.');
      setDeleteConfirmation(false);
    })
    .catch((error) => {
      setFormError('Error deleting plan.');
      console.error('Error deleting plan:', error);
    });
  };

  const cancelDelete = () => {
    setSelectedPlanId(null);
    setDeleteConfirmation(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Available Plans
      </Typography>
      <Divider sx={{ marginBottom: '1rem' }} />
      <Grid container alignItems="center" justifyContent="space-between">
      {role === "Admin" && (
        <Grid item>
          <Button variant="contained" color="success" onClick={handleOpenModal}>Add Plan</Button>
        </Grid>
      )}
      </Grid>
      <br />
      <Grid container spacing={2}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ marginBottom: '2rem' }} variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {plan.plan_name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {plan.plan_description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Period: {plan.period} days
                </Typography>
                <Typography variant="h5">
                  Price: ${plan.price}
                </Typography>
              </CardContent>
              <CardActions>
                {role === "Client" && (
                <Button size="small" variant="contained" color="info">
                  Choose Plan
                </Button>
                )}
                {(role === "Admin" || role === "SalesAgent") && (
                <Button size="small" variant="contained" color="info" onClick={() => handleUpdatePlan(plan)}>
                  Update Plan
                </Button>
                )}
                {role === "Admin" && (
                <Button size="small" variant="contained" color="error" onClick={() => handleDeletePlan(plan.id)}>
                  Delete Plan
                </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Plan Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-plan-modal"
        aria-describedby="add-plan-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(400px + 20%)', // Increase width by 20%
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px', // Rounded corners
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom>
            {modalButtonText}
          </Typography>
          {formError && (
            <Typography variant="body2" color="error" gutterBottom>
              {formError}
            </Typography>
          )}
          {formSuccess && (
            <Typography variant="body2" color="success" gutterBottom>
              {formSuccess}
            </Typography>
          )}
          <form>
            <TextField
              label="Plan Name"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Plan Description"
              name="plan_description"
              value={formData.plan_description}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Period (days)"
              name="period"
              value={formData.period}
              onChange={handleFormChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
              fullWidth
              sx={{ mt: 2 }}
            >
              {modalButtonText}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmation}
        onClose={cancelDelete}
        aria-labelledby="delete-plan-modal"
        aria-describedby="delete-plan-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(400px + 20%)', // Increase width by 20%
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px', // Rounded corners
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Delete
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this plan?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Button variant="contained" color="primary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Plans;






// import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import axios from 'axios';

// const Plans = () => {
//   const [plans, setPlans] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [formData, setFormData] = useState({
//     plan_name: '',
//     plan_description: '',
//     period: '',
//     price: '',
//   });
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = () => {
//     fetch('http://127.0.0.1:8001/accounts/api/plans/')
//       .then((response) => response.json())
//       .then((data) => setPlans(data.plans))
//       .catch((error) => console.error('Error fetching plans:', error));
//   };

//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFormSubmit = () => {
//     axios.post('http://127.0.0.1:8001/accounts/api/plans/', formData, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then(() => {
//       handleCloseModal();
//       fetchPlans(); // Fetch plans again to update the list
//     })
//     .catch((error) => console.error('Error adding plan:', error));
//   };

//   return (
//     <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
//       <Typography variant="h5" gutterBottom>
//         Available Plans
//       </Typography>
//       <Divider sx={{ marginBottom: '1rem' }} />
//       <Grid container alignItems="center" justifyContent="space-between">
//         <Grid item>
//           <Button variant="contained" color="success" onClick={handleOpenModal}>Add Plan</Button>
//         </Grid>
//       </Grid>
//       <br />
//       <Grid container spacing={2}>
//         {plans.map((plan, index) => (
//           <Grid item xs={12} sm={6} key={index}>
//             <Card sx={{ marginBottom: '2rem' }} variant="outlined">
//               <CardContent>
//                 <Typography variant="h6" component="h2" gutterBottom>
//                   {plan.plan_name}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary">
//                   {plan.plan_description}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Period: {plan.period} days
//                 </Typography>
//                 <Typography variant="h5">
//                   Price: ${plan.price}
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" color="primary">
//                   Subscribe
//                 </Button>
//                 <Button size="small" color="primary">
//                   Update Plan
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Add Plan Modal */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="add-plan-modal"
//         aria-describedby="add-plan-form"
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 'calc(400px + 20%)', // Increase width by 20%
//             bgcolor: 'background.paper',
//             border: '2px solid #000',
//             boxShadow: 24,
//             p: 4,
//             borderRadius: '16px', // Rounded corners
//           }}
//         >
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//             <IconButton onClick={handleCloseModal}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Typography variant="h6" gutterBottom>
//             Add Plan
//           </Typography>
//           <form>
//             <TextField
//               label="Plan Name"
//               name="plan_name"
//               value={formData.plan_name}
//               onChange={handleFormChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Plan Description"
//               name="plan_description"
//               value={formData.plan_description}
//               onChange={handleFormChange}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Period (days)"
//               name="period"
//               value={formData.period}
//               onChange={handleFormChange}
//               type="number"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Price"
//               name="price"
//               value={formData.price}
//               onChange={handleFormChange}
//               type="number"
//               fullWidth
//               margin="normal"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleFormSubmit}
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Add Plan
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//     </Container>
//   );
// };

// export default Plans;
