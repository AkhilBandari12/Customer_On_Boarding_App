import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LayersIcon from '@mui/icons-material/Layers';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: "white",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const role = localStorage.getItem('role');
  const first_name = localStorage.getItem('first_name');
  const last_name =  localStorage.getItem('last_name');

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `#3A3F51`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "white !important",
        },
        "& .pro-menu-item.active": {
          color: "white !important",
          backgroundColor:"#BEC1C7 !important"
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "white",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={"white"}>
                  Flexydial
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={"white"}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {`${first_name} ${last_name}`}
                </Typography>
                <Typography variant="h5" color={"white"}>
                  {role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
            <Divider sx={{ color: "white" }} />
            </Typography>
            <Item
              title="My Profile"
              to="/myprofile"
              icon={<AccountCircleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {role === "Client" && (
              <>
              <Item
              title="E-KYC"
              to="/ekyc"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                {/* Add additional items for Client */}
              </>
            )}
            
            <Item
              title="Plans"
              to="/plans"
              icon={<LayersIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Render based on role */}
            {role === "Admin" && (
              <>
                <Typography
                  variant="h6"
                  color={"#cacccf"}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  <Divider sx={{ color: "white" }} />
                </Typography>
                <Item
                  title="Admin/SalesAgent"
                  to="/createaos"
                  icon={<AddBoxIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Client Assignment"
                  to="/assign"
                  icon={<AssignmentTurnedInIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="All Users"
                  to="/allusers"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Access Management"
                  to="/access-management"
                  icon={<VpnKeyIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {/* Additional items for SalesAgent or Client */}
            {role === "SalesAgent" && (
              <>
              <Item
                  title="Approve"
                  to="/assignedtome"
                  icon={<VerifiedUserIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* Add additional items for SalesAgent */}
              </>
            )}

            {role === "Client" && (
              <>
                {/* Add additional items for Client */}
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;




















// import { useState } from "react";
// import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import Divider from '@mui/material/Divider';
// import { Link } from "react-router-dom";
// import "react-pro-sidebar/dist/css/styles.css";
// import { tokens } from "../../theme";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LayersIcon from '@mui/icons-material/Layers';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: "white",
//       }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const Sidebar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const role = localStorage.getItem('role');
//   const first_name = localStorage.getItem('first_name');
//   const last_name =  localStorage.getItem('last_name');

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: "white",
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" color={"white"}>
//                   Flexydial
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <Box mb="25px">
//               <Box textAlign="center">
//                 <Typography
//                   variant="h4"
//                   color={"white"}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 0 0" }}
//                 >
//                   {`${first_name} ${last_name}`}
//                 </Typography>
//                 <Typography variant="h5" color={colors.greenAccent[500]}>
//                   {role}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Dashboard"
//               to="/dashboard"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             <Typography
//               variant="h6"
//               color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//             <Divider />
//             </Typography>
//             <Item
//               title="My Profile"
//               to="/myprofile"
//               icon={<AccountCircleIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {role === "Client" && (
//               <>
//               <Item
//               title="E-KYC"
//               to="/ekyc"
//               icon={<ReceiptOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//                 {/* Add additional items for Client */}
//               </>
//             )}
            
//             <Item
//               title="Plans"
//               to="/plans"
//               icon={<LayersIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             {/* Render based on role */}
//             {role === "Admin" && (
//               <>
//                 <Typography
//                   variant="h6"
//                   color={colors.grey[300]}
//                   sx={{ m: "15px 0 5px 20px" }}
//                 >
//                   USER MANAGEMENT
//                 </Typography>
//                 <Item
//                   title="Admin/SalesAgent"
//                   to="/createaos"
//                   icon={<AddBoxIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 <Item
//                   title="Client Assignment"
//                   to="/assign"
//                   icon={<AssignmentTurnedInIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 <Item
//                   title="All Users"
//                   to="/allusers"
//                   icon={<PeopleOutlinedIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//               </>
//             )}

//             {/* Additional items for SalesAgent or Client */}
//             {role === "SalesAgent" && (
//               <>
//               <Item
//                   title="Approve"
//                   to="/assignedtome"
//                   icon={<VerifiedUserIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 {/* Add additional items for SalesAgent */}
//               </>
//             )}

//             {role === "Client" && (
//               <>
//                 {/* Add additional items for Client */}
//               </>
//             )}
//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };

// export default Sidebar;













// import { useState } from "react";
// import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import Divider from '@mui/material/Divider';
// import { Link } from "react-router-dom";
// import "react-pro-sidebar/dist/css/styles.css";
// import { tokens } from "../../theme";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LayersIcon from '@mui/icons-material/Layers';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: "white",
//       }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const Sidebar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const role = localStorage.getItem('role');
//   const first_name = localStorage.getItem('first_name');
//   const last_name =  localStorage.getItem('last_name');

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: "white",
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" color={"white"}>
//                   Flexydial
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <Box mb="25px">
//               {/* <Box display="flex" justifyContent="center" alignItems="center">
//                 <img
//                   alt="profile-user"
//                   width="100px"
//                   height="100px"
//                   src={`../../assets/user.png`}
//                   style={{ cursor: "pointer", borderRadius: "50%" }}
//                 />
//               </Box> */}
//               <Box textAlign="center">
//                 <Typography
//                   variant="h4"
//                   color={"white"}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 0 0" }}
//                 >
//                   {`${first_name} ${last_name}`}
//                 </Typography>
//                 <Typography variant="h5" color={colors.greenAccent[500]}>
//                   {role}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Dashboard"
//               to="/dashboard"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             <Typography
//               variant="h6"
//               color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//             <Divider />
//             </Typography>
//             <Item
//               title="My Profile"
//               to="/myprofile"
//               icon={<AccountCircleIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="E-KYC"
//               to="/ekyc"
//               icon={<ReceiptOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Plans"
//               to="/plans"
//               icon={<LayersIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Typography
//               variant="h6"
//               color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//               USER MANAGEMENT
//             </Typography>
//             <Item
//               title="Admin/SalesAgent"
//               to="/createaos"
//               icon={<AddBoxIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Client Assignment"
//               to="/assign"
//               icon={<AssignmentTurnedInIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="All Users"
//               to="/allusers"
//               icon={<PeopleOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Approve"
//               to="/assignedtome"
//               icon={<VerifiedUserIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {/* <Item
//               title="Contacts Information"
//               to="/contacts"
//               icon={<ContactsOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Invoices Balances"
//               to="/invoices"
//               icon={<ReceiptOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             <Typography
//               variant="h6"
//               color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//               Pages
//             </Typography>
//             <Item
//               title="Profile Form"
//               to="/form"
//               icon={<PersonOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Calendar"
//               to="/calendar"
//               icon={<CalendarTodayOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="FAQ Page"
//               to="/faq"
//               icon={<HelpOutlineOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             <Typography
//               variant="h6"
//               color={colors.grey[300]}
//               sx={{ m: "15px 0 5px 20px" }}
//             >
//               Charts
//             </Typography>
//             <Item
//               title="Bar Chart"
//               to="/bar"
//               icon={<BarChartOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Pie Chart"
//               to="/pie"
//               icon={<PieChartOutlineOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Line Chart"
//               to="/line"
//               icon={<TimelineOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="Geography Chart"
//               to="/geography"
//               icon={<MapOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             /> */}
//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };

// export default Sidebar;
