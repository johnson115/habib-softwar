import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Home from "./pages/home";
import PrivateRoute from "./components/privateRoute";
import PerfectAvatar from "./pages/perfectavatar";
import MillionDollarMessage from "./pages/milliondollars";
import PerfectOffer from "./pages/perfectOffer";
import UltimateLeadMagnet from "./pages/ultimateLeadMagnet";
import TrafficOnDemand from "./pages/trafficondemande";
import RetargetingRoadmap from "./pages/retargetingRoadmap";
import CheckProjects from "./components/checkProjects";
import CreateLaunchmap from "./pages/createProject";
import GlobalAdminPage from "./admin/admin";
import Info from "./pages/info";
import MatrixRoadmap from "./pages/matrix";
import BusinessEngine from "./pages/BusinessEngine";
import WebinarTemplate from "./pages/WebinarTemplate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />  
        <Route path="/" element={
          <CheckProjects>
            <CreateLaunchmap/>
          </CheckProjects>
        } />  
        
        <Route path="/info" element={<PrivateRoute>  <Info/>  </PrivateRoute>}/>
        <Route path="/home/:projectId" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/perfect-avatar/:projectId" element={<PrivateRoute><PerfectAvatar /></PrivateRoute>} />
        <Route path="/million-dollar-message/:projectId" element={<PrivateRoute><MillionDollarMessage /></PrivateRoute>} />
        <Route path="/perfect-offer/:projectId" element={<PrivateRoute><PerfectOffer /></PrivateRoute>} />
        <Route path="/ultimate-lead-magnet/:projectId" element={<PrivateRoute><UltimateLeadMagnet /></PrivateRoute>} />
        <Route path="/Matrix-Roadmap/:projectId" element={<PrivateRoute><MatrixRoadmap /></PrivateRoute>} />
        <Route path="/Business-Engine/:projectId" element={<PrivateRoute><BusinessEngine /></PrivateRoute>} />
        <Route path="/Webinar-Template/:projectId" element={<PrivateRoute><WebinarTemplate /></PrivateRoute>} />
        <Route path="/traffic-on-demand/:projectId" element={<PrivateRoute><TrafficOnDemand /></PrivateRoute>} />
        <Route path="/retargeting-roadmap/:projectId" element={<PrivateRoute><RetargetingRoadmap /></PrivateRoute>} />
        <Route path="/Haboub" element={<GlobalAdminPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;