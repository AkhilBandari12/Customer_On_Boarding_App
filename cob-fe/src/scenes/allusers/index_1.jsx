import { Box, Typography, useTheme } from "@mui/material";
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
        setAllUsers(data.all_users); // Assuming your response has an 'all_users' property containing the list of users
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const columns = [
    { field: "email", headerName: "Email", flex: 1 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row }) => {
        return (
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
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing the Users" />
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
            color: `blue !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={allUsers} columns={columns} />
      </Box>
    </Box>
  );
};

export default AllUsers;












// const fetchAllUsers = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8001/accounts/api/userlistview/", {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     // Generate unique IDs for each user
  //     // const usersWithIds = data.all_users.map((user, index) => ({
  //     //   ...user,
  //     //   id: user.id || index + 1, // Use the provided ID or generate one based on index
  //     // }));
  //     // setAllUsers(usersWithIds);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

























// import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { useEffect, useState } from "react";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import Header from "../../components/Header";

// const Team = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [allUsers, setAllUsers] = useState([]);
//   const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3ODYyOTkzLCJpYXQiOjE3MTc4NjI2OTMsImp0aSI6IjUwOGE0MTMxNzI3YzQ2OWE4MzFjZjUxOGYyM2ZkNGViIiwidXNlcl9pZCI6Mjl9.dP-2-DHO2UGEMtj_iaO-em8AJDJZP2ew6n5ICJEYk4A";

//   useEffect(() => {
//     fetchAllUsers();
//   }, []); // Corrected dependency array

//   const fetchAllUsers = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8001/accounts/api/userlistview/", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();
//       // Generate unique IDs for each user
//       const usersWithIds = data.all_users.map((user, index) => ({
//         ...user,
//         id: user.id || index + 1, // Use the provided ID or generate one based on index
//       }));
//       setAllUsers(usersWithIds);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const columns = [
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "first_name", headerName: "First Name", flex: 1 },
//     { field: "last_name", headerName: "Last Name", flex: 1 },
//     {
//       field: "role",
//       headerName: "Role",
//       flex: 1,
//       renderCell: ({ row }) => {
//         return (
//           <Box
//             width="60%"
//             m="0 auto"
//             p="5px"
//             display="flex"
//             justifyContent="center"
//             backgroundColor={
//               row.role === "Admin"
//                 ? colors.greenAccent[600]
//                 : row.role === "SalesAgent"
//                 ? colors.greenAccent[700]
//                 : colors.greenAccent[700]
//             }
//             borderRadius="4px"
//           >
//             {row.role === "Admin" && <AdminPanelSettingsOutlinedIcon />}
//             {row.role === "SalesAgent" && <SecurityOutlinedIcon />}
//             {row.role === "Client" && <LockOpenOutlinedIcon />}
//             <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
//               {row.role}
//             </Typography>
//           </Box>
//         );
//       },
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="TEAM" subtitle="Managing the Team Members" />
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
//         <DataGrid checkboxSelection rows={allUsers} columns={columns} />
//       </Box>
//     </Box>
//   );
// };

// export default Team;

