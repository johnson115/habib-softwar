import React from "react";
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Home from "./pages/home";
import PrivateRoute from "./components/privateRoute";
import PerfectAvatar from "./pages/perfectavatar";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />  
        <Route path="/" element={
          <PrivateRoute>
          <Home />
          </PrivateRoute>
        } />  
        <Route path="/perfect-avatar" element={<PerfectAvatar/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
