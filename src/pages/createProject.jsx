import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateLaunchmap() {
  const [launchMapName, setLaunchMapName] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!launchMapName.trim()) {
      setError('Project name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/projectapi.php/projects', 
        { name: launchMapName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setSnackbarMessage('Project added successfully!');
      setSnackbarOpen(true);
      // Navigate to the home page with the new project ID
      navigate(`/home/${response.data.id}`);
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.response?.data?.message || 'An error occurred while creating the project. Please try again.');
      setSnackbarMessage('Failed to create project. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <X size={24} />
        </Box>
        <Typography component="h1" variant="h4" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
          CREATE A NEW LAUNCHMAP
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="launchMapName"
            label="LAUNCHMAP'S NAME"
            name="launchMapName"
            autoFocus
            value={launchMapName}
            onChange={(e) => setLaunchMapName(e.target.value)}
            inputProps={{ maxLength: 30 }}
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: 'primary.main' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'CREATE LAUNCHMAP'}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

