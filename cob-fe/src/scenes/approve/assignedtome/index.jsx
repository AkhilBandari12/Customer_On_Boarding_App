// AssignedToMe.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import CryptoJS from 'crypto-js';

const AssignedToMe = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clients, setClients] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8001/accounts/api/userlistview/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleViewDetails = (client) => {
    // Encrypt client id before passing to client details card
    const encryptedClientId = encodeURIComponent(CryptoJS.AES.encrypt(client.id.toString(), 'secret_key').toString());
    navigate(`/clientdetailscard/${encryptedClientId}`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1, 
      valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "company_name", headerName: "Company Name", flex: 1 },
    // { field: "country", headerName: "Country", flex: 1 },
    // { field: "city", headerName: "City", flex: 1 },
    { field: "employee_count", headerName: "Employee Count", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "mobile_number", headerName: "Mobile Number", flex: 1 },
    {
      field: "view_details", 
      headerName: "View Details", 
      flex: 1, 
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleViewDetails(params.row)}>View Details</Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Assigned Clients" subtitle="Clients assigned to me" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#3A3F51",
            color: "#FFFFFF",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#3A3F51",
          },
          "& .MuiCheckbox-root": {
            color: `#658ac2 !important`,
          },
        }}
      >
        <DataGrid rows={clients} columns={columns} />
      </Box>
    </Box>
  );
};

export default AssignedToMe;





























// import React, { useState, useEffect } from 'react';
// import { Box, Typography, useTheme, Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../../theme";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Header from "../../../components/Header";
// import CryptoJS from 'crypto-js';

// const AssignedToMe = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [clients, setClients] = useState([]);
//   const accessToken = localStorage.getItem("accessToken");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const fetchClients = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8001/accounts/api/userlistview/", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       setClients(response.data.clients);
//     } catch (error) {
//       console.error('Error fetching clients:', error);
//     }
//   };

//   const handleViewDetails = (client) => {
//     // Encrypt client id before passing to client details card
//     const encryptedClientId = CryptoJS.AES.encrypt(client.id.toString(), 'secret_key').toString();
//     navigate(`/clientdetailscard/${encryptedClientId}`);
//   };

//   const columns = [
//     { 
//       field: "name", 
//       headerName: "Name", 
//       flex: 1, 
//       valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`
//     },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "company_name", headerName: "Company Name", flex: 1 },
//     { field: "country", headerName: "Country", flex: 1 },
//     { field: "city", headerName: "City", flex: 1 },
//     { field: "employee_count", headerName: "Employee Count", flex: 1 },
//     { field: "product", headerName: "Product", flex: 1 },
//     { field: "mobile_number", headerName: "Mobile Number", flex: 1 },
//     {
//       field: "view_details", 
//       headerName: "View Details", 
//       flex: 1, 
//       renderCell: (params) => (
//         <Button variant="contained" color="primary" onClick={() => handleViewDetails(params.row)}>View Details</Button>
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="Assigned Clients" subtitle="Clients assigned to me" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[700],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[700],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//         }}
//       >
//         <DataGrid rows={clients} columns={columns} />
//       </Box>
//     </Box>
//   );
// };

// export default AssignedToMe;
