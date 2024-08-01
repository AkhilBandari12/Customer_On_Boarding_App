import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import MyProfile from "./scenes/myprofile";
import EKYCForm from "./scenes/ekyc";
import Plans from "./scenes/plans/plans";
import AssignedToMe from "./scenes/approve/assignedtome";
import ClientDetailsCard from "./scenes/approve/clientdetailscard";
import AllUsers from "./scenes/allusers";
import CreateAos from "./scenes/createaos";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./scenes/login";
import Registration from "./scenes/registration";
import AssignClientsToSalesAgent from "./scenes/assignclientstosalesagents";
import HomePage from "./scenes/homepage";
import NotFound from "./scenes/notfound/notfound";
import ChangePassword from "./scenes/changepassword";
import EditMyProfile from "./scenes/myprofile/editmyprofile";
import AccessManagement from "./scenes/accessmanagement";
import ForgotPasswordMailPage from "./scenes/forgotpassword/forgotpasswordmailpage";
import ForgotConfirmPassword from "./scenes/forgotpassword";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState(null);

  const hideSidebarAndTopbarRoutes = ["/"];
  const showSidebarAndTopbar = !hideSidebarAndTopbarRoutes.includes(location.pathname);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      // Redirect to the stored location upon successful login
      if (redirectTo) {
        navigate(redirectTo);
        setRedirectTo(null); // Reset redirectTo after redirection
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate, redirectTo]);

  // Function to handle navigating to client details with encrypted client ID
  const handleClientDetailsNavigation = (encryptedClientId) => {
    navigate(`/clientdetailscard/${encodeURIComponent(encryptedClientId)}`);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && showSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {isAuthenticated && showSidebarAndTopbar && <Topbar notifications={notifications} />}
            <Routes>
              {/* <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setNotifications={setNotifications} />}
              />
              */}
              <Route
                path="/forgot-password"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPasswordMailPage />}
              /> 
              <Route
                path="/forgot-confirmpassword/:uidb64/:token"
                element={isAuthenticated ? (<Navigate to="/dashboard" />) : ( < ForgotConfirmPassword />)}
              />
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage setNotifications={setNotifications} />}
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/myprofile"
                element={isAuthenticated ? <MyProfile /> : <Navigate to="/" />}
              />
              <Route
                path="/edit-myprofile"
                element={
                  isAuthenticated ? (
                    <EditMyProfile />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/access-management"
                element={
                  isAuthenticated ? (
                    <AccessManagement />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/change-password"
                element={isAuthenticated ? <ChangePassword /> : <Navigate to="/" />}
              />
              <Route
                path="/ekyc"
                element={isAuthenticated ? <EKYCForm /> : <Navigate to="/" />}
              />
              <Route
                path="/plans"
                element={isAuthenticated ? <Plans /> : <Navigate to="/" />}
              />
              <Route
                path="/allusers"
                element={isAuthenticated ? <AllUsers /> : <Navigate to="/" />}
              />
              <Route
                path="/assignedtome"
                element={isAuthenticated ? <AssignedToMe /> : <Navigate to="/" />}
              />
              <Route
                path="/clientdetailscard/:clientId"
                element={isAuthenticated ? <ClientDetailsCard /> : <Navigate to="/" />}
              />
              <Route
                path="/assign"
                element={isAuthenticated ? <AssignClientsToSalesAgent /> : <Navigate to="/" />}
              />
              <Route
                path="/createaos"
                element={isAuthenticated ? <CreateAos setNotifications={setNotifications} /> : <Navigate to="/" />}
              />
              {/* 404 route handling */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;









// import { useState } from "react";
// import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
// import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";
// import MyProfile from "./scenes/myprofile";
// import EKYCForm from "./scenes/ekyc";
// import Plans from "./scenes/plans/plans";
// import AssignedToMe from "./scenes/approve/assignedtome";
// import ClientDetailsCard from "./scenes/approve/clientdetailscard";
// import AllUsers from "./scenes/allusers";
// import CreateAos from "./scenes/createaos";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Login from "./scenes/login";
// import Registration from "./scenes/registration";
// import AssignClientsToSalesAgent from "./scenes/assignclientstosalesagents";
// import HomePage from "./scenes/homepage";

// function App() {
//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);
//   const [notifications, setNotifications] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role")
//   const acessToken = localStorage.getItem("accessToken")
  
//   // Determine whether to show Sidebar and Topbar based on the current route
//   const hideSidebarAndTopbarRoutes = ["/", "/login","/registration"];
//   const showSidebarAndTopbar = !hideSidebarAndTopbarRoutes.includes(location.pathname);

//   // Function to handle navigating to client details with encrypted client ID
//   const handleClientDetailsNavigation = (encryptedClientId) => {
//     navigate(`/clientdetailscard/${encodeURIComponent(encryptedClientId)}`);
//   };

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div className="app">
//           {showSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
//           <main className="content">
//             {showSidebarAndTopbar && <Topbar notifications={notifications} />}
//             <Routes>
//               <Route path="/login" element={<Login setNotifications={setNotifications} />} />
//               <Route path="/registration" element={<Registration setNotifications={setNotifications} />} />
//               <Route path="/" element={<HomePage />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/myprofile" element={<MyProfile />} />
//               <Route path="/ekyc" element={<EKYCForm />} />
//               <Route path="/plans" element={<Plans />} />
//               <Route path="/allusers" element={<AllUsers />} />
//               <Route path="/assignedtome" element={<AssignedToMe />} />
//               <Route path="/clientdetailscard/:clientId" element={<ClientDetailsCard />} />
//               <Route path="/assign" element={<AssignClientsToSalesAgent />} />
//               <Route path="/createaos" element={<CreateAos setNotifications={setNotifications} />} />
//             </Routes>
//           </main>
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App;















            // <Route
            //   path="/login"
            //   element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setNotifications={setNotifications} />}
            // />
            // <Route
            //   path="/registration"
            //   element={isAuthenticated ? <Navigate to="/dashboard" /> : <Registration setNotifications={setNotifications} />}
            // />
            // <Route
            //   path="/"
            //   element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage setNotifications={setNotifications} />}
            // />
            //   <Route
            //     path="/dashboard"
            //     element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            //   />