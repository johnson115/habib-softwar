import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Box, Button } from "@mui/material";

const CheckProjects = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Fetching projects...");

      const response = await axios.get("http://localhost/projectapi.php/projects", {
        headers: { 
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (response.data.length === 0) {
        setLoading(false);
        return; // This will render children (CreateLaunchmap)
      }

      const firstProject = response.data[0];
      localStorage.setItem("activeProject", firstProject.id);
      navigate(`/home/${firstProject.id}`);
      
    } catch (error) {
      console.error("Error fetching projects:", error.response || error);
      setError(error.response?.data?.message || "Failed to fetch projects. Please try again.");
      setLoading(false);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => {
          setLoading(true);
          setError(null);
          fetchProjects();
        }}>
          Retry
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default CheckProjects;

