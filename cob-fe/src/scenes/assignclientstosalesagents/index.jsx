import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import Header from "../../components/Header"; // Adjust path as needed
import { tokens } from "../../theme"; // Adjust path as needed

const AssignClientsToSalesAgent = () => {
  const [clients, setClients] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [selectedSalesAgent, setSelectedSalesAgent] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);

  // State for DataGrid
  const [gridRows, setGridRows] = useState([]);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8001/accounts/api/userlistview/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { clients, sales_agents } = response.data;

      const formattedClients = clients.map((client) => ({
        id: client.client_id,
        name: `${client.first_name} ${client.last_name} (${client.company_name})`,
        email: client.email,
        mobile_number: client.mobile_number,
      }));

      const formattedSalesAgents = sales_agents.map((agent) => ({
        id: agent.id,
        name: `${agent.first_name} ${agent.last_name}`,
        username:agent.username,
        email: agent.email,
        mobile_number: agent.mobile_number,
      }));

      setClients(formattedClients);
      setSalesAgents(formattedSalesAgents);
      setGridRows(formattedClients); // Set DataGrid rows here if needed
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSalesAgentSelect = (event) => {
    setSelectedSalesAgent(event.target.value);
  };

  const handleClientSelect = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter((id) => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleAssign = async () => {
    if (!selectedSalesAgent || selectedClients.length === 0) {
      alert("Please select a sales agent and at least one client.");
      return;
    }

    try {
      const response = await axios.patch("http://127.0.0.1:8001/accounts/api/assigntosalesagent/", {
        salesagent_id: selectedSalesAgent,
        client_ids: selectedClients,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      alert(response.data.message);
      fetchData(); // Refresh data after assignment
      setSelectedClients([]);
    } catch (error) {
      console.error("Error assigning clients to sales agent:", error);
      alert("Failed to assign clients to sales agent.");
    }
  };

  return (
    <Box m={2}>
      <Header title="Assign Clients to Sales Agent" subtitle="Select clients and a sales agent to assign" />
      <Container>
        <Box display="flex" justifyContent="space-between">
          <Box flex="2" mr={2}>
        <Typography variant="h4">List of Clients</Typography>
        <TableContainer component={Paper} sx={{ minHeight:'450px', maxHeight: '500px', overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleClientSelect(client.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
          <Box flex="1" ml={2}>
            <Typography variant="h4">List of Sales Agents</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: '350px'}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Select Sales Agent</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FormControl component="fieldset" sx={{ paddingLeft:"30px" }}>
                    <RadioGroup
                      aria-label="salesAgent"
                      name="salesAgent"
                      value={selectedSalesAgent}
                      onChange={handleSalesAgentSelect}
                    >
                      {salesAgents.map((agent) => (
                        <FormControlLabel
                          key={agent.id}
                          value={agent.id}
                          control={<Radio />}
                          label={`${agent.name} - [${agent.username}]`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box mt={2}>
          <Button variant="contained" onClick={handleAssign}>
            Assign Clients to Sales Agent
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AssignClientsToSalesAgent;

















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Grid,
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Radio,
//   RadioGroup,
//   Typography,
//   useTheme,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
// } from "@mui/material";
// import Header from "../../components/Header";
// import { DataGrid } from "@mui/x-data-grid";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import { tokens } from "../../theme";

// const AssignClientsToSalesAgent = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [clients, setClients] = useState([]);
//   const [salesAgents, setSalesAgents] = useState([]);
//   const [selectedSalesAgent, setSelectedSalesAgent] = useState(null);
//   const [selectedClients, setSelectedClients] = useState([]);

//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     fetchClientsAndSalesAgents();
//   }, []);

//   const fetchClientsAndSalesAgents = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8001/accounts/api/userlistview/",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const { clients, sales_agents } = response.data;

//       const filteredClients = clients.map((client) => ({
//         id: client.client_id,
//         name: client.first_name + " " + client.last_name + " (" + client.company_name + ")",
//         email: client.email,
//         mobile_number: client.mobile_number,
//       }));

//       const filteredSalesAgents = sales_agents.map((user) => ({
//         id: user.id,
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         mobile_number: user.mobile_number,
//       }));

//       setClients(filteredClients);
//       setSalesAgents(filteredSalesAgents);
//     } catch (error) {
//       console.error("Error fetching clients and sales agents:", error);
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedSalesAgent || selectedClients.length === 0) {
//       alert("Please select a sales agent and at least one client.");
//       return;
//     }

//     try {
//       const response = await axios.patch(
//         "http://127.0.0.1:8001/accounts/api/assigntosalesagent/",
//         {
//           salesagent_id: selectedSalesAgent,
//           client_ids: selectedClients,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       alert(response.data.message);
//       fetchClientsAndSalesAgents();
//       setSelectedClients([]);
//     } catch (error) {
//       console.error("Error assigning clients to sales agent:", error);
//       alert("Failed to assign clients to sales agent.");
//     }
//   };

//   const handleSalesAgentSelect = (event) => {
//     setSelectedSalesAgent(event.target.value);
//   };

//   const handleClientSelect = (clientId) => {
//     if (selectedClients.includes(clientId)) {
//       setSelectedClients(selectedClients.filter((id) => id !== clientId));
//     } else {
//       setSelectedClients([...selectedClients, clientId]);
//     }
//   };

//   return (
//     <Box m="20px">
//       <Header
//         title="Assign Clients to Sales Agent"
//         subtitle="Select clients and a sales agent to assign"
//       />
//       <Container>
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <Typography variant="h4">List of Clients</Typography>
//             <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Client Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Select</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {clients.map((client) => (
//                     <TableRow key={client.id}>
//                       <TableCell>{client.name}</TableCell>
//                       <TableCell>{client.email}</TableCell>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedClients.includes(client.id)}
//                           onChange={() => handleClientSelect(client.id)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="h4">List of Sales Agents</Typography>
//             <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Sales Agent Name</TableCell>
//                     <TableCell>Username</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {salesAgents.map((salesAgent) => (
//                     <TableRow key={salesAgent.id}>
//                       <TableCell>{salesAgent.name}</TableCell>
//                       <TableCell>{salesAgent.id}</TableCell>
//                       <TableCell>
//                         <Radio
//                           checked={selectedSalesAgent === salesAgent.id}
//                           onChange={() => handleSalesAgentSelect(salesAgent.id)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>
//         </Grid>
//         <Button variant="contained" onClick={handleAssign}>
//           Assign Clients to Sales Agent
//         </Button>
//         <Box
//           m="40px 0 0 0"
//           height="75vh"
//           sx={{
//             "& .MuiDataGrid-root": {
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: "none",
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: colors.blueAccent[700],
//               borderBottom: "none",
//             },
//             "& .MuiDataGrid-virtualScroller": {
//               backgroundColor: colors.primary[400],
//             },
//             "& .MuiDataGrid-footerContainer": {
//               borderTop: "none",
//               backgroundColor: colors.blueAccent[700],
//             },
//             "& .MuiCheckbox-root": {
//               color: `${colors.greenAccent[200]} !important`,
//             },
//           }}
//         >
//           {/* Add DataGrid here if needed */}
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default AssignClientsToSalesAgent;















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Radio,
//   RadioGroup,
//   Button,
//   Typography,
//   Container,
//   useTheme,
// } from "@mui/material";
// import Header from "../../components/Header";

// const AssignClientsToSalesAgent = () => {
//   const theme = useTheme();
//   const colors = theme.palette.mode === "light" ? theme.palette.primary : theme.palette.secondary;

//   const [clients, setClients] = useState([]);
//   const [salesAgents, setSalesAgents] = useState([]);
//   const [selectedSalesAgent, setSelectedSalesAgent] = useState(null);
//   const [selectedClients, setSelectedClients] = useState([]);

//   // Define accessToken
//   const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3ODY1Mzc2LCJpYXQiOjE3MTc4NjUwNzYsImp0aSI6IjkwMzIyNGRmYjZmZTQzNzRiOTU4NjU2YjcxY2M2MmYyIiwidXNlcl9pZCI6Mjl9.3oHxMIS4cGfIJ8Bxmuo_Fv2-IlWsUOcRrsJjbo4WqrA";

//   useEffect(() => {
//     fetchClientsAndSalesAgents();
//   }, []);

//   const fetchClientsAndSalesAgents = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8001/accounts/api/userlistview/", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       const { clients, sales_agents } = response.data;

//       // Filter out only the clients
//       const filteredClients = clients.map(client => ({
//         id: client.client_id,
//         name: client.company_name,
//         email: client.email,
//         mobile_number: client.mobile_number,
//       }));

//       // Filter out only the sales agents
//       const filteredSalesAgents = sales_agents.map(user => ({
//         id: user.id,
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         mobile_number: user.mobile_number,
//       }));

//       setClients(filteredClients);
//       setSalesAgents(filteredSalesAgents);
//     } catch (error) {
//       console.error("Error fetching clients and sales agents:", error);
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedSalesAgent || selectedClients.length === 0) {
//       alert("Please select a sales agent and at least one client.");
//       return;
//     }

//     try {
//       const response = await axios.patch("http://127.0.0.1:8001/accounts/api/assigntosalesagent/", {
//         salesagent_id: selectedSalesAgent,
//         client_ids: selectedClients,
//       }, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       alert(response.data.message);
//       // Refresh client list after assignment
//       fetchClientsAndSalesAgents();
//       setSelectedClients([]);
//     } catch (error) {
//       console.error("Error assigning clients to sales agent:", error);
//       alert("Failed to assign clients to sales agent.");
//     }
//   };

//   const handleSalesAgentSelect = (event) => {
//     setSelectedSalesAgent(event.target.value);
//   };

//   const handleClientSelect = (clientId) => {
//     if (selectedClients.includes(clientId)) {
//       setSelectedClients(selectedClients.filter((id) => id !== clientId));
//     } else {
//       setSelectedClients([...selectedClients, clientId]);
//     }
//   };

//   return (
//     <Box m="20px">
//       <Header title="Assign Clients to Sales Agent" subtitle="Select clients and a sales agent to assign" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           // Your styling here
//         }}
//       >
//         <form>
//           <Typography variant="h4">List of Clients</Typography>
//           <FormControl component="fieldset">
//             <FormLabel component="legend">Select Clients</FormLabel>
//             {clients.map((client) => (
//               <FormControlLabel
//                 key={client.id}
//                 control={
//                   <Checkbox
//                     checked={selectedClients.includes(client.id)}
//                     onChange={() => handleClientSelect(client.id)}
//                   />
//                 }
//                 label={client.name}
//               />
//             ))}
//           </FormControl>
//           <Typography variant="h4">List of Sales Agents</Typography>
//           <FormControl component="fieldset">
//             <FormLabel component="legend">Select Sales Agent</FormLabel>
//             <RadioGroup
//               aria-label="salesAgent"
//               name="salesAgent"
//               value={selectedSalesAgent}
//               onChange={handleSalesAgentSelect}
//             >
//               {salesAgents.map((salesAgent) => (
//                 <FormControlLabel
//                   key={salesAgent.id} // Use sales agent's id as the key
//                   value={salesAgent.id}
//                   control={<Radio />}
//                   label={salesAgent.name}
//                 />
//               ))}
//             </RadioGroup>
//           </FormControl>
//           <Button variant="contained" onClick={handleAssign}>
//             Assign Clients to Sales Agent
//           </Button>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default AssignClientsToSalesAgent;
