import { Box, Button, Typography, useTheme, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const AllUsers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All');
  const [showCompanyName, setShowCompanyName] = useState(false);
  const [showApprovalStatus, setShowApprovalStatus] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/accounts/api/userlistview/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data && data.all_users) {
        setAllUsers(data.all_users);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowCompanyName(role === 'Client');
    setShowApprovalStatus(role === 'Client');
  };

  const filteredUsers = selectedRole === 'All' ? allUsers : allUsers.filter(user => user.role === selectedRole);

  const columns = [
    {
      field: "serialNumber",
      headerName: "S.No.",
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
      flex: 0.3,
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    {
      field: "company_name",
      headerName: "Company Name",
      flex: 1,
      hide: !showCompanyName,
    },
    {
      field: "approval_status",
      headerName: "Approval Status",
      flex: 1,
      hide: !showApprovalStatus,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            fontWeight: 'bold',
            color: row.is_approved ? 'green' : 'red',
          }}
        >
          {row.is_approved ? "Approved" : "Pending"}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            row.role === "Admin"
              ? colors.greenAccent[600]
              : row.role === "SalesAgent"
              ? colors.greenAccent[700]
              : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {row.role === "Admin" && <AdminPanelSettingsOutlinedIcon />}
          {row.role === "SalesAgent" && <SecurityOutlinedIcon />}
          {row.role === "Client" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {row.role}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="10px">
        <Box mb={2} display="flex" justifyContent="space-between" sx={{ backgroundColor: "#3A3F51", color: "#FFFFFF"}}>
  <ToggleButtonGroup
    value={selectedRole}
    exclusive
    onChange={(event, newRole) => handleRoleClick(newRole)}
    aria-label="role selection"
    sx={{ width: "100%" }}
  >
    <ToggleButton
      value="Admin"
      variant="contained"
      sx={{
        width: "100%",
        color: "#FFFFFF",
        backgroundColor: selectedRole === "Admin" ? "#636879" : "#3A3F51",
        boxShadow: selectedRole === "Admin" ? "0 0 10px #3A3F51" : "none",
        '&.Mui-selected': {
          color: "#FFFFFF",
          fontWeight: "bold",
          boxShadow: "0 0 10px #3A3F51",
        }
      }}
    >
      <Typography variant="body1" fontWeight={selectedRole === "Admin" ? "bold" : "normal"} color="inherit">
        Admin
      </Typography>
    </ToggleButton>
    <ToggleButton
      value="SalesAgent"
      variant="contained"
      sx={{
        width: "100%",
        color: "#FFFFFF",
        backgroundColor: selectedRole === "SalesAgent" ? "#636879" : "#3A3F51",
        boxShadow: selectedRole === "SalesAgent" ? "0 0 10px #3A3F51" : "none",
        '&.Mui-selected': {
          color: "#FFFFFF",
          fontWeight: "bold",
          boxShadow: "0 0 10px #3A3F51",
        }
      }}
    >
      <Typography variant="body1" fontWeight={selectedRole === "SalesAgent" ? "bold" : "normal"} color="inherit">
        SalesAgent
      </Typography>
    </ToggleButton>
    <ToggleButton
      value="Client"
      variant="contained"
      sx={{
        width: "100%",
        color: "#FFFFFF",
        backgroundColor: selectedRole === "Client" ? "#636879" : "#3A3F51",
        boxShadow: selectedRole === "Client" ? "0 0 10px #3A3F51" : "none",
        '&.Mui-selected': {
          color: "#FFFFFF",
          fontWeight: "bold",
          boxShadow: "0 0 10px #3A3F51",
        }
      }}
    >
      <Typography variant="body1" fontWeight={selectedRole === "Client" ? "bold" : "normal"} color="inherit">
        Client
      </Typography>
    </ToggleButton>
  </ToggleButtonGroup>
</Box>


      <Box
        m="20px 0 0 0"
        height="80vh"
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
            color: "#FFFFFF",
            backgroundColor: "#3A3F51",
          },
          "& .MuiCheckbox-root": {
            color: `blue !important`,
          },
        }}
      >
        <DataGrid rows={filteredUsers} columns={columns} getRowId={(row) => row.id} />
      </Box>
    </Box>
  );
};

export default AllUsers;
