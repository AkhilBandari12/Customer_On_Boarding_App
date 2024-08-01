import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, useTheme } from '@mui/material';
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dashboardData, setDashboardData] = useState(null);
  const [counts, setCounts] = useState({
    newClientsCount: 0,
    clientsApprovedCount: 0,
    pendingApprovalCount: 0,
    ekycPendingCount: 0,
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get('http://127.0.0.1:8001/accounts/api/dashboard/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDashboardData(response.data);

        // Calculate counts from response data
        const newClientsCount = response.data.new_clients ? response.data.new_clients.length : 0;
        const clientsApprovedCount = response.data.clients_approved ? response.data.clients_approved.length : 0;
        const pendingApprovalCount = response.data.pending_approval ? response.data.pending_approval.length : 0;
        const ekycPendingCount = response.data.ekyc_pending ? response.data.ekyc_pending.length : 0;

        setCounts({
          newClientsCount,
          clientsApprovedCount,
          pendingApprovalCount,
          ekycPendingCount,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBoxClick = (category) => {
    setActiveCategory(category);
  };

  const renderClientTable = (dashboardData, category) => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: '350px' }}>
        <Table stickyHeader>
          <TableHead >
            <TableRow>
              <TableCell>Client ID</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Client Company</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>City</TableCell>
              {category === "clients_approved" && <TableCell>Approved By</TableCell>}
              {category === "pending_approval" && <TableCell>Assigned to</TableCell>}
              {category === "ekyc_pending" && <TableCell>Contact</TableCell>}
              {/* Add more fields as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardData[category].map((client) => (
              <TableRow key={client.client_id}>
                <TableCell>{client.client_id}</TableCell>
                <TableCell>{client.first_name} {client.last_name}</TableCell>
                <TableCell>{client.company_name}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>{client.city}</TableCell>
                {category === "clients_approved" && <TableCell>{client.assigned_to}</TableCell>}
                {category === "pending_approval" && <TableCell>{client.assigned_to}</TableCell>}
                {category === "ekyc_pending" && <TableCell>{client.mobile_number}</TableCell>}
                {/* Add more table cells based on fields */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTable = () => {
    if (activeCategory === "newClients") {
      return renderClientTable(dashboardData, "new_clients");
    } else if (activeCategory === "clientsApproved") {
      return renderClientTable(dashboardData, "clients_approved");
    } else if (activeCategory === "pendingApproval") {
      return renderClientTable(dashboardData, "pending_approval");
    } else if (activeCategory === "ekycPending") {
      return renderClientTable(dashboardData, "ekyc_pending");
    }
    return null;
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header sx={{ color: "#3A3F51" }} title="DASHBOARD" subtitle="Welcome to your dashboard" />

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {role === "Admin" && (
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleBoxClick("newClients")}
            style={{ cursor: "pointer", boxShadow: activeCategory === "newClients" ? `0 0 10px #3A3F51` : "none" }}
          >
            <StatBox
              title={counts.newClientsCount}
              subtitle="New Clients"
              icon={
                <PersonAddIcon
                  sx={{ color: "#3A3F51", fontSize: "26px" }}
                />
              }
            />
          </Box>
        )}
        {(role === "Admin" || role === "SalesAgent") && (
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleBoxClick("clientsApproved")}
            style={{ cursor: "pointer", boxShadow: activeCategory === "clientsApproved" ? `0 0 10px #3A3F51` : "none" }}
          >
            <StatBox
              title={counts.clientsApprovedCount}
              subtitle="Clients Approved"
              icon={
                <VerifiedIcon
                  sx={{ color: "#3A3F51", fontSize: "26px" }}
                />
              }
            />
          </Box>
        )}
        {(role === "Admin" || role === "SalesAgent") && (
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleBoxClick("pendingApproval")}
            style={{ cursor: "pointer", boxShadow: activeCategory === "pendingApproval" ? `0 0 10px #3A3F51` : "none" }}
          >
            <StatBox
              title={counts.pendingApprovalCount}
              subtitle="Approvals Pending"
              icon={
                <HourglassTopIcon
                  sx={{ color: "#3A3F51", fontSize: "26px" }}
                />
              }
            />
          </Box>
        )}
        {(role === "Admin" || role === "SalesAgent") && (
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleBoxClick("ekycPending")}
            style={{ cursor: "pointer", boxShadow: activeCategory === "ekycPending" ? `0 0 10px #3A3F51` : "none" }}
          >
            <StatBox
              title={counts.ekycPendingCount}
              subtitle="E-KYC Pending Clients"
              icon={
                <PendingActionsIcon
                  sx={{ color: "#3A3F51", fontSize: "26px" }}
                />
              }
            />
          </Box>
        )}
      </Box>

      {/* Table Section */}
      <Box mt={4}>
        {activeCategory && (
          <Box gridColumn="span 12">
            {renderTable()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;














// import { Box, useTheme } from "@mui/material";
// import { tokens } from "../../theme";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; 
// import VerifiedIcon from '@mui/icons-material/Verified';
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import Header from "../../components/Header";
// import StatBox from "../../components/StatBox";
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';


// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [counts, setCounts] = useState({
//     newClientsCount: 0,
//     clientsApprovedCount: 0,
//     pendingApprovalCount: 0,
//     ekycPendingCount: 0,
//   });
//   const [activeCategory, setActiveCategory] = useState(null);
//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/dashboard/', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setDashboardData(response.data);

//         // Calculate counts from response data
//         const newClientsCount = response.data.new_clients ? response.data.new_clients.length : 0;
//         const clientsApprovedCount = response.data.clients_approved ? response.data.clients_approved.length : 0;
//         const pendingApprovalCount = response.data.pending_approval ? response.data.pending_approval.length : 0;
//         const ekycPendingCount = response.data.ekyc_pending ? response.data.ekyc_pending.length : 0;

//         setCounts({
//           newClientsCount,
//           clientsApprovedCount,
//           pendingApprovalCount,
//           ekycPendingCount,
//         });
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleBoxClick = (category) => {
//     setActiveCategory(category);
//   };

//   const renderClientTable = (dashboardData, category) => {
//     return (
//       <TableContainer component={Paper} sx={{ maxHeight: '350px' }}>
//         <Table stickyHeader>
//           <TableHead >
//             <TableRow>
//             <TableCell>Client ID</TableCell>
//               <TableCell>Client Name</TableCell>
//               <TableCell>Client Company</TableCell>
//               <TableCell>Country</TableCell>
//               <TableCell>City</TableCell>
//               {category === "clients_approved" && <TableCell>Approved By</TableCell>}
//               {category === "pending_approval" && <TableCell>Assigned to</TableCell>}
//               {category === "ekyc_pending" && <TableCell>Contact</TableCell>}
//               {/* Add more fields as needed */}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {dashboardData[category].map((client) => (
//               <TableRow key={client.client_id}>
//                 <TableCell>{client.client_id}</TableCell>
//                 <TableCell>{client.first_name} {client.last_name}</TableCell>
//                 <TableCell>{client.company_name}</TableCell>
//                 <TableCell>{client.country}</TableCell>
//                 <TableCell>{client.city}</TableCell>
//                 {category === "clients_approved" && <TableCell>{client.assigned_to}</TableCell>}
//                 {category === "pending_approval" && <TableCell>{client.assigned_to}</TableCell>}
//                 {category === "ekyc_pending" && <TableCell>{client.mobile_number}</TableCell>}
//                 {/* Add more table cells based on fields */}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   const renderTable = () => {
//     if (activeCategory === "newClients") {
//       return renderClientTable(dashboardData, "new_clients");
//     } else if (activeCategory === "clientsApproved") {
//       return renderClientTable(dashboardData, "clients_approved");
//     } else if (activeCategory === "pendingApproval") {
//       return renderClientTable(dashboardData, "pending_approval");
//     } else if (activeCategory === "ekycPending") {
//       return renderClientTable(dashboardData, "ekyc_pending");
//     }
//     return null;
//   };

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Header sx={{ color: "#3A3F51" }} title="DASHBOARD" subtitle="Welcome to your dashboard" />

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         {role === "Admin" && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             onClick={() => handleBoxClick("newClients")}
//             style={{ cursor: "pointer" }}
//           >
//             <StatBox
//               title={counts.newClientsCount}
//               subtitle="New Clients"
//               icon={
//                 <PersonAddIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             onClick={() => handleBoxClick("clientsApproved")}
//             style={{ cursor: "pointer" }}
//           >
//             <StatBox
//               title={counts.clientsApprovedCount}
//               subtitle="Clients Approved"
//               icon={
//                 <VerifiedIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             onClick={() => handleBoxClick("pendingApproval")}
//             style={{ cursor: "pointer" }}
//           >
//             <StatBox
//               title={counts.pendingApprovalCount}
//               subtitle="Approvals Pending"
//               icon={
//                 <HourglassTopIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             onClick={() => handleBoxClick("ekycPending")}
//             style={{ cursor: "pointer" }}
//           >
//             <StatBox
//               title={counts.ekycPendingCount}
//               subtitle="E-KYC Pending Clients"
//               icon={
//                 <PendingActionsIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//       </Box>

//       {/* Table Section */}
//       <Box mt={4}>
//         {activeCategory && (
//           <Box gridColumn="span 12">
//             <Header subtitle={`${activeCategory} Details`}/>
//             {renderTable()}
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;





// import { Box, useTheme } from "@mui/material";
// import { tokens } from "../../theme";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import VerifiedIcon from '@mui/icons-material/Verified';
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import Header from "../../components/Header";
// import StatBox from "../../components/StatBox";
// import PendingActionsIcon from '@mui/icons-material/PendingActions';

// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [counts, setCounts] = useState({
//     newClientsCount: 0,
//     clientsApprovedCount: 0,
//     pendingApprovalCount: 0,
//     ekycPendingCount: 0,
//   });
//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/dashboard/', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setDashboardData(response.data);

//         // Calculate counts from response data
//         const newClientsCount = response.data.new_clients ? response.data.new_clients.length : 0;
//         const clientsApprovedCount = response.data.clients_approved ? response.data.clients_approved.length : 0;
//         const pendingApprovalCount = response.data.pending_approval ? response.data.pending_approval.length : 0;
//         const ekycPendingCount = response.data.ekyc_pending ? response.data.ekyc_pending.length : 0;

//         setCounts({
//           newClientsCount,
//           clientsApprovedCount,
//           pendingApprovalCount,
//           ekycPendingCount,
//         });
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Header sx={{ color: "#3A3F51" }} title="DASHBOARD" subtitle="Welcome to your dashboard" />

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         {role === "Admin" && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={counts.newClientsCount}
//               subtitle="New Clients"
//               icon={
//                 <PersonAddIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={counts.clientsApprovedCount}
//               subtitle="Clients Approved"
//               icon={
//                 <VerifiedIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={counts.pendingApprovalCount}
//               subtitle="Approvals Pending"
//               icon={
//                 <HourglassTopIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={counts.ekycPendingCount}
//               subtitle="E-KYC Pending Clients"
//               icon={
//                 <PendingActionsIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//       </Box>
//       {/* DIV SECTION */}
//       <br />
//       <Box
//         gridColumn="span 1"
//         backgroundColor={colors.primary[400]}
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         {/* Render your table or other content here */}
//         <Box>
//           <Header title="Users" subtitle="Managing the Users" />
//           {/* Table with headers and rows */}
//           <Box>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Client Name</th>
//                   <th>Client Email ID</th>
//                   <th>Organization</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Render table rows based on data */}
//                 {/* Example row */}
//                 <tr>
//                   <td>John Doe</td>
//                   <td>john.doe@example.com</td>
//                   <td>Company XYZ</td>
//                 </tr>
//               </tbody>
//             </table>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;

























































































// import { Box, useTheme } from "@mui/material";
// import { tokens } from "../../theme";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import VerifiedIcon from '@mui/icons-material/Verified';
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import HourglassTopIcon from '@mui/icons-material/HourglassTop';
// import Header from "../../components/Header";
// import StatBox from "../../components/StatBox";
// import PendingActionsIcon from '@mui/icons-material/PendingActions';


// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [dashboardData, setDashboardData] = useState(null);
//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         const response = await axios.get('http://127.0.0.1:8001/accounts/api/dashboard/', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Header sx={{ color: "#3A3F51" }} title="DASHBOARD" subtitle="Welcome to your dashboard" />

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         {role === "Admin" && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={dashboardData ? dashboardData.new_clients : ""}
//               subtitle="New Clients"
//               icon={
//                 <PersonAddIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={dashboardData ? dashboardData.clients_approved : ""}
//               subtitle="Clients Approved"
//               icon={
//                 <VerifiedIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={dashboardData ? dashboardData.pending_approval : ""}
//               subtitle="Approvals Pending"
//               icon={
//                 <HourglassTopIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//         {(role === "Admin" || role === "SalesAgent") && (
//           <Box
//             gridColumn="span 3"
//             backgroundColor={colors.primary[400]}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <StatBox
//               title={dashboardData ? dashboardData.ekyc_pending : ""}
//               subtitle="E-KYC Pending Clients"
//               icon={
//                 <PendingActionsIcon
//                   sx={{ color: "#3A3F51", fontSize: "26px" }}
//                 />
//               }
//             />
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
