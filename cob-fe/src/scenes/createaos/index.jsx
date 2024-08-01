import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const CreateAos = ({ setNotifications }) => {
  const [notification, setNotification] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchRoleOptions();
    fetchLocations();
  }, []);

  const fetchRoleOptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/accounts/api/get_role_names/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const filteredRoles = response.data.filter(role => role !== 'Client');
      setRoleOptions(filteredRoles);
    } catch (error) {
      console.error('Error fetching role names:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/accounts/api/get_locations/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8001/accounts/api/create-aos-user/', values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 201) {
        const newNotification = { type: 'success', message: 'User created successfully' };
        setNotification(newNotification);
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
      }
    } catch (error) {
      const newNotification = { type: 'error', message: 'Failed to create user' };
      setNotification(newNotification);
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    }
    setSubmitting(false);
  };

  const initialValues = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    mobile_number: '',
    location: '',
  };

  const validationSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    username: yup.string()
      .required('Username is required')
      .matches(/^[a-zA-Z0-9]+$/, 'Username should only contain alphanumeric characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/,
        'Password must be at least 8 characters, and contain at least one numeric digit, one uppercase and one lowercase letter.'
      ),
    role: yup.string().required('Role is required'),
    mobile_number: yup.string()
      .required('Mobile number is required')
      .matches(/^(?:\+91-?)?(?:0)?[6-9]\d{9}$/, 'Invalid mobile number'),
    location: yup.string().required('Location is required'),
  });

  return (
    <Box m={2}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Username"
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="" disabled>
                    Select a Role
                  </MenuItem>
                  {roleOptions.map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Mobile Number"
                  type="text"
                  name="mobile_number"
                  value={values.mobile_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.mobile_number && !!errors.mobile_number}
                  helperText={touched.mobile_number && errors.mobile_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Location"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.location && !!errors.location}
                  helperText={touched.location && errors.location}
                >
                  <MenuItem value="" disabled>
                    Select a location
                  </MenuItem>
                  {locations.map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating User...' : 'Create User'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {notification && (
        <Box mt={2} p={2} bgcolor={notification.type === 'success' ? 'success.main' : 'error.main'} color="white">
          {notification.message}
        </Box>
      )}
    </Box>
  );
};

export default CreateAos;








// import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const CreateAos = ({ setNotifications }) => {
//   const [notification, setNotification] = useState(null);
//   const [roleOptions, setRoleOptions] = useState([]);
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetchRoleOptions();  // Fetch role options on component mount
//   }, []);

//   const fetchRoleOptions = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8001/accounts/api/get_role_names/",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       console.log("Role options response:", response.data);
//       // Filter out 'Client' role
//       const filteredRoles = response.data.filter(role => role !== 'Client');
//       console.log("Filtered roles:", filteredRoles);
//       setRoleOptions(filteredRoles);  // Set role options excluding 'Client'
//     } catch (error) {
//       console.error("Error fetching role names:", error);
//     }
//   };
  

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 3000); // Auto fade after 3 seconds

//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [notification]);

//   const handleFormSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8001/accounts/api/create-aos-user/",
//         values,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       if (response.status === 201) {
//         const newNotification = { type: "success", message: "User created successfully" };
//         setNotification(newNotification);
//         setNotifications(prevNotifications => [...prevNotifications, newNotification]);
//       }
//     } catch (error) {
//       const newNotification = { type: "error", message: "Failed to create user" };
//       setNotification(newNotification);
//       setNotifications(prevNotifications => [...prevNotifications, newNotification]);
//     }
//     setSubmitting(false);
//   };

//   return (
//     <Box m="20px">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleFormSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting,
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Username"
//                   type="text"
//                   name="username"
//                   value={values.username}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.username && !!errors.username}
//                   helperText={touched.username && errors.username}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Email"
//                   type="email"
//                   name="email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Password"
//                   type="password"
//                   name="password"
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.password && !!errors.password}
//                   helperText={touched.password && errors.password}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   select
//                   label="Role"
//                   type="text"
//                   name="role"
//                   value={values.role}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.role && !!errors.role}
//                   helperText={touched.role && errors.role}
//                 >
//                   {roleOptions.map((role) => (
//                     <MenuItem key={role} value={role}>
//                       {role}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Mobile Number"
//                   type="text"
//                   name="mobile_number"
//                   value={values.mobile_number}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.mobile_number && !!errors.mobile_number}
//                   helperText={touched.mobile_number && errors.mobile_number}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Location"
//                   type="text"
//                   name="location"
//                   value={values.location}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.location && !!errors.location}
//                   helperText={touched.location && errors.location}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   color="primary"
//                   variant="contained"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Creating User..." : "Create User"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//       {notification && (
//         <Box mt={2} p={2} bgcolor={notification.type === "success" ? "success.main" : "error.main"} color="white">
//           {notification.message}
//         </Box>
//       )}
//     </Box>
//   );
// };

// const initialValues = {
//   username: "",
//   email: "",
//   password: "",
//   role: "",
//   mobile_number: "",
//   location: "",
// };

// const validationSchema = yup.object().shape({
//   username: yup.string().required("Username is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().required("Password is required"),
//   role: yup.string().required("Role is required"),
//   mobile_number: yup.string().required("Mobile number is required"),
//   location: yup.string().required("Location is required"),
// });

// export default CreateAos;






// import { Box, Button, Grid, TextField } from "@mui/material";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const CreateAos = ({ setNotifications }) => {
//   const [notification, setNotification] = useState(null);
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 3000); // Auto fade after 5 seconds

//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [notification]);

//   const handleFormSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8001/accounts/api/create-aos-user/",
//         values,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       if (response.status === 201) {
//         const newNotification = { type: "success", message: "User created successfully" };
//         setNotification(newNotification);
//         setNotifications(prevNotifications => [...prevNotifications, newNotification]);
//       }
//     } catch (error) {
//       const newNotification = { type: "error", message: "Failed to create user" };
//       setNotification(newNotification);
//       setNotifications(prevNotifications => [...prevNotifications, newNotification]);
//     }
//     setSubmitting(false);
//   };

//   return (
//     <Box m="20px">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleFormSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting,
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Username"
//                   type="text"
//                   name="username"
//                   value={values.username}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.username && !!errors.username}
//                   helperText={touched.username && errors.username}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Email"
//                   type="email"
//                   name="email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.email && !!errors.email}
//                   helperText={touched.email && errors.email}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Password"
//                   type="password"
//                   name="password"
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.password && !!errors.password}
//                   helperText={touched.password && errors.password}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Role"
//                   type="text"
//                   name="role"
//                   value={values.role}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.role && !!errors.role}
//                   helperText={touched.role && errors.role}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Mobile Number"
//                   type="text"
//                   name="mobile_number"
//                   value={values.mobile_number}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.mobile_number && !!errors.mobile_number}
//                   helperText={touched.mobile_number && errors.mobile_number}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   variant="filled"
//                   label="Location"
//                   type="text"
//                   name="location"
//                   value={values.location}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.location && !!errors.location}
//                   helperText={touched.location && errors.location}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   color="primary"
//                   variant="contained"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Creating User..." : "Create User"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//       {notification && (
//         <Box mt={2} p={2} bgcolor={notification.type === "success" ? "success.main" : "error.main"} color="white">
//           {notification.message}
//         </Box>
//       )}
//     </Box>
//   );
// };

// const initialValues = {
//   username: "",
//   email: "",
//   password: "",
//   role: "",
//   mobile_number: "",
//   location: "",
// };

// const validationSchema = yup.object().shape({
//   username: yup.string().required("Username is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().required("Password is required"),
//   role: yup.string().required("Role is required"),
//   mobile_number: yup.string().required("Mobile number is required"),
//   location: yup.string().required("Location is required"),
// });

// export default CreateAos;
