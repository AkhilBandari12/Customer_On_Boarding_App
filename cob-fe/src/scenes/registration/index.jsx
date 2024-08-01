import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Grid, TextField, MenuItem, IconButton, InputAdornment, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Registration = ({ setNotifications, openLoginModal }) => {
  const [notification, setNotification] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [products, setProducts] = useState([]);
  const [employeeCounts, setEmployeeCounts] = useState([]);
  const [registered, setRegistered] = useState(false); // State to track successful registration

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/accounts/api/get_countries/');
        setCountries(response.data);  // Assuming response.data is an array of country names
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/accounts/api/get_products/');
        setProducts(response.data);  // Assuming response.data is an array of product names
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchEmployeeCounts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/accounts/api/get_employeecount/');
        setEmployeeCounts(response.data);  // Assuming response.data is an array of employee count options
      } catch (error) {
        console.error('Error fetching employee counts:', error);
      }
    };

    fetchCountries();
    fetchProducts();
    fetchEmployeeCounts();
  }, []);

  const initialValues = {
    user: {
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      password: '',
      confirmPassword: ''
    },
    client: {
      company_name: '',
      country: '',
      city: '',
      address: '',
      employee_count: '',
      product: ''
    }
  };

  const validationSchema = yup.object().shape({
    user: yup.object().shape({
      first_name: yup.string()
        .required('First Name is required')
        .matches(/^[a-zA-Z]+$/, 'First Name should only contain alphabetic characters')
        .max(20, 'First Name must be at most 20 characters long'),

      last_name: yup.string()
        .required('Last Name is required')
        .matches(/^[a-zA-Z]+$/, 'Last Name should only contain alphabetic characters')
        .max(20, 'Last Name must be at most 20 characters long'),

      email: yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .test('unique-email', 'Email already exists!', async function (value) {
          if (!value) return false;
          try {
            const response = await axios.get(`http://127.0.0.1:8001/accounts/api/check-email/?email=${encodeURIComponent(value)}`);
            return !response.data.exists;
          } catch (error) {
            console.error('Error checking email:', error);
            return true;
          }
        }),

      mobile_number: yup.string()
        .matches(/^(?:\+91-?)?(?:0)?[6-9]\d{9}$/, 'Invalid mobile number')
        .required('Mobile Number is required')
        .test('unique-mobile-number', 'Mobile number already exists!', async function (value) {
          if (!value) return false;
          try {
            const response = await axios.get(`http://127.0.0.1:8001/accounts/api/check-mobile/?mobile=${encodeURIComponent(value)}`);
            return !response.data.exists;
          } catch (error) {
            console.error('Error checking mobile number:', error);
            return true;
          }
        }),

      password: yup.string()
        .required('Password is required')
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/,
          "Password must be at least 8 characters, and contain at least one numeric digit, one uppercase and one lowercase letter."
        ),

      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
    }),

    client: yup.object().shape({
      company_name: yup.string()
        .required('Company Name is required')
        .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Company Name should be alphanumeric with one space max after each word'),

      country: yup.string().required('Country is required'),
      city: yup.string().required('City is required'),
      address: yup.string().required('Address is required'),
      employee_count: yup.string().required('Employee Count is required'),
      product: yup.string().required('Product is required')
    })
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    values.user.username = values.user.email;
    const response = await axios.post('http://127.0.0.1:8001/accounts/api/create-client/', values);
    if (response.status === 201) {
      // Handle successful registration
      const newNotification = {
        type: 'success',
        message: 'User registered successfully'
      };
      setNotification(newNotification);

      setTimeout(() => {
        resetForm();
        setSubmitting(false);
        setNotification(null);
        setRegistered(true); // Update state to show confirmation message
        // setRedirectToLogin(true);
      }, 3000);
    } else {
      console.error('Unexpected response:', response);
      const errorNotification = {
        type: 'error',
        message: 'Failed to register user'
      };
      setNotification(errorNotification);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server responded with an error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up the request:', error.message);
    }
    // Handle other errors (e.g., network failure)
    console.error('Error registering user:', error);
    const errorNotification = {
      type: 'error',
      message: 'Failed to register user'
    };
    setNotification(errorNotification);
  }
};


  return (
    <Box>
      <br />
      {!registered ? ( // Conditionally render registration form
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="user.first_name"
                    label="First Name"
                    value={values.user.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.first_name && !!errors.user?.first_name}
                    helperText={touched.user?.first_name && errors.user?.first_name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="user.last_name"
                    label="Last Name"
                    value={values.user.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.last_name && !!errors.user?.last_name}
                    helperText={touched.user?.last_name && errors.user?.last_name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="user.email"
                    label="Email address"
                    value={values.user.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.email && !!errors.user?.email}
                    helperText={touched.user?.email && errors.user?.email}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="user.mobile_number"
                    label="Mobile Number"
                    value={values.user.mobile_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.mobile_number && !!errors.user?.mobile_number}
                    helperText={touched.user?.mobile_number && errors.user?.mobile_number}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="client.company_name"
                    label="Company Name"
                    value={values.client.company_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.company_name && !!errors.client?.company_name}
                    helperText={touched.client?.company_name && errors.client?.company_name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="client.country"
                    select
                    label="Country"
                    value={values.client.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.country && !!errors.client?.country}
                    helperText={touched.client?.country && errors.client?.country}
                    fullWidth
                  >
                    {countries.map((country, index) => (
                      <MenuItem key={index} value={country}>{country}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="client.city"
                    label="City"
                    value={values.client.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.city && !!errors.client?.city}
                    helperText={touched.client?.city && errors.client?.city}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="client.address"
                    label="Address"
                    value={values.client.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.address && !!errors.client?.address}
                    helperText={touched.client?.address && errors.client?.address}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="client.employee_count"
                    select
                    label="Employee Count"
                    value={values.client.employee_count}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.employee_count && !!errors.client?.employee_count}
                    helperText={touched.client?.employee_count && errors.client?.employee_count}
                    fullWidth
                  >
                    {employeeCounts.map((count, index) => (
                      <MenuItem key={index} value={count}>{count}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="client.product"
                    select
                    label="Product"
                    value={values.client.product}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client?.product && !!errors.client?.product}
                    helperText={touched.client?.product && errors.client?.product}
                    fullWidth
                  >
                    {products.map((product, index) => (
                      <MenuItem key={index} value={product}>{product}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="user.password"
                    label="Password"
                    type="password"
                    value={values.user.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.password && !!errors.user?.password}
                    helperText={touched.user?.password && errors.user?.password}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="user.confirmPassword"
                    label="Confirm Password"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    value={values.user.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user?.confirmPassword && !!errors.user?.confirmPassword}
                    helperText={touched.user?.confirmPassword && errors.user?.confirmPassword}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            edge="end"
                          >
                            {confirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      ) : (
        // Display confirmation message after successful registration
        <Box mt={2} p={2} bgcolor="#4caf50" color="#fff">
          <Typography variant="h6">
            Thank you for registering!
          </Typography>
          <Typography>
            A confirmation email containing your credentials has been sent to your inbox.
            Please check your email for further instructions on logging in.
          </Typography>
        </Box>
      )}
      {notification && (
        <Box mt={2} p={2} bgcolor={notification.type === 'success' ? '#4caf50' : '#f44336'} color="#fff">
          {notification.message}
        </Box>
      )}
    </Box>
  );
};

export default Registration;































































































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Button, Grid, TextField, MenuItem, IconButton, InputAdornment } from '@mui/material';
// import { Formik } from 'formik';
// import * as yup from 'yup';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// const Registration = ({ setNotifications, openLoginModal }) => {
//   const [notification, setNotification] = useState(null);
//   const [redirectToLogin, setRedirectToLogin] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   useEffect(() => {
//     if (redirectToLogin) {
//       const timer = setTimeout(() => {
//         openLoginModal();
//         setRedirectToLogin(false);
//       }, 3000);

//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [redirectToLogin, openLoginModal]);

//   const initialValues = {
//     user: {
//       first_name: '',
//       last_name: '',
//       email: '',
//       mobile_number: '',
//       password: '',
//       confirmPassword: ''
//     },
//     client: {
//       company_name: '',
//       country: '',
//       city: '',
//       address: '',
//       employee_count: '',
//       product: ''
//     }
//   };

//   const validationSchema = yup.object().shape({
//     user: yup.object().shape({
//       first_name: yup.string()
//         .required('First Name is required')
//         .matches(/^[a-zA-Z]+$/, 'First Name should only contain alphabetic characters')
//         .max(20, 'First Name must be at most 20 characters long'),

//       last_name: yup.string()
//         .required('Last Name is required')
//         .matches(/^[a-zA-Z]+$/, 'Last Name should only contain alphabetic characters')
//         .max(20, 'Last Name must be at most 20 characters long'),

//       email: yup.string()
//         .email('Invalid email address')
//         .required('Email is required')
//         .test('unique-email', 'Email already exists!', async function (value) {
//           if (!value) return false;
//           try {
//             const response = await axios.get(`http://127.0.0.1:8001/accounts/api/check-email/?email=${encodeURIComponent(value)}`);
//             return !response.data.exists;
//           } catch (error) {
//             console.error('Error checking email:', error);
//             return true;
//           }
//         }),

//       mobile_number: yup.string()
//         .matches(/^(?:\+91-?)?(?:0)?[6-9]\d{9}$/, 'Invalid mobile number')
//         .required('Mobile Number is required')
//         .test('unique-mobile-number', 'Mobile number already exists!', async function (value) {
//           if (!value) return false;
//           try {
//             const response = await axios.get(`http://127.0.0.1:8001/accounts/api/check-mobile/?mobile=${encodeURIComponent(value)}`);
//             return !response.data.exists;
//           } catch (error) {
//             console.error('Error checking mobile number:', error);
//             return true;
//           }
//         }),

//       password: yup.string()
//         .required('Password is required')
//         .matches(
//           /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/,
//           "Password must be at least 8 characters, and contain at least one numeric digit, one uppercase and one lowercase letter."
//         ),

//       confirmPassword: yup.string()
//         .oneOf([yup.ref('password'), null], 'Passwords must match')
//     }),

//     client: yup.object().shape({
//       company_name: yup.string()
//         .required('Company Name is required')
//         .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Company Name should be alphanumeric with one space max after each word'),

//       country: yup.string().required('Country is required'),
//       city: yup.string().required('City is required'),
//       address: yup.string().required('Address is required'),
//       employee_count: yup.string().required('Employee Count is required'),
//       product: yup.string().required('Product is required')
//     })
//   });

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const response = await axios.post('http://127.0.0.1:8001/accounts/api/create-client/', values);
//       if (response.status === 201) {
//         const newNotification = {
//           type: 'success',
//           message: 'User registered successfully'
//         };
//         setNotification(newNotification);

//         setTimeout(() => {
//           resetForm();
//           setSubmitting(false);
//           setNotification(null);
//           setRedirectToLogin(true);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Error registering user:', error);
//       const errorNotification = {
//         type: 'error',
//         message: 'Failed to register user'
//       };
//       setNotification(errorNotification);
//     }
//   };

//   return (
//     <Box>
//       <br />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting,
//           setFieldValue
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="user.first_name"
//                   label="First Name"
//                   value={values.user.first_name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.first_name && !!errors.user?.first_name}
//                   helperText={touched.user?.first_name && errors.user?.first_name}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="user.last_name"
//                   label="Last Name"
//                   value={values.user.last_name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.last_name && !!errors.user?.last_name}
//                   helperText={touched.user?.last_name && errors.user?.last_name}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="user.email"
//                   label="Email address"
//                   value={values.user.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.email && !!errors.user?.email}
//                   helperText={touched.user?.email && errors.user?.email}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="user.mobile_number"
//                   label="Mobile Number"
//                   value={values.user.mobile_number}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.mobile_number && !!errors.user?.mobile_number}
//                   helperText={touched.user?.mobile_number && errors.user?.mobile_number}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   name="client.company_name"
//                   label="Company Name"
//                   value={values.client.company_name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.company_name && !!errors.client?.company_name}
//                   helperText={touched.client?.company_name && errors.client?.company_name}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="client.country"
//                   label="Country"
//                   value={values.client.country}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.country && !!errors.client?.country}
//                   helperText={touched.client?.country && errors.client?.country}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="client.city"
//                   label="City"
//                   value={values.client.city}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.city && !!errors.client?.city}
//                   helperText={touched.client?.city && errors.client?.city}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   name="client.address"
//                   label="Address"
//                   value={values.client.address}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.address && !!errors.client?.address}
//                   helperText={touched.client?.address && errors.client?.address}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="client.employee_count"
//                   select
//                   label="Employee Count"
//                   value={values.client.employee_count}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.employee_count && !!errors.client?.employee_count}
//                   helperText={touched.client?.employee_count && errors.client?.employee_count}
//                   fullWidth
//                 >
//                   <MenuItem value="0-50">0-50</MenuItem>
//                   <MenuItem value="50-100">50-100</MenuItem>
//                   <MenuItem value="100-500">100-500</MenuItem>
//                   <MenuItem value="500-2000">500-2000</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="client.product"
//                   select
//                   label="Product"
//                   value={values.client.product}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.client?.product && !!errors.client?.product}
//                   helperText={touched.client?.product && errors.client?.product}
//                   fullWidth
//                 >
//                   <MenuItem value="Voice Solution">Voice Solution</MenuItem>
//                   <MenuItem value="ChatBots">ChatBots</MenuItem>
//                   <MenuItem value="Education">Education</MenuItem>
//                   <MenuItem value="Email Solution">Email Solution</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   name="user.password"
//                   label="Password"
//                   type="password"
//                   value={values.user.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.password && !!errors.user?.password}
//                   helperText={touched.user?.password && errors.user?.password}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   name="user.confirmPassword"
//                   label="Confirm Password"
//                   type={confirmPasswordVisible ? 'text' : 'password'}
//                   value={values.user.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.user?.confirmPassword && !!errors.user?.confirmPassword}
//                   helperText={touched.user?.confirmPassword && errors.user?.confirmPassword}
//                   fullWidth
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle confirm password visibility"
//                           onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//                           edge="end"
//                         >
//                           {confirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                         </IconButton>
//                       </InputAdornment>
//                     )
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button
//                   fullWidth
//                   size="large"
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Registering...' : 'Register'}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//       {notification && (
//         <Box mt={2} p={2} bgcolor={notification.type === 'success' ? '#4caf50' : '#f44336'} color="#fff">
//           {notification.message}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Registration;

