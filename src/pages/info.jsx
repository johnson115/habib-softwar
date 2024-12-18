import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Lock, Eye, EyeOff , ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const Info = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleChange = (prop) => (event) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      setSuccess(response.data.message);
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };


  const {projectId} = useParams();
const navigate=useNavigate();
  return (
    <Box className="passsword" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',}}>
      <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(`/home/${projectId}`)}
            sx={{ mb: 2 }}
          >
           Go Back
          </Button>
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{marginRight:"auto" , marginLeft:"auto"}}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', justifyContent:"center", textAlign:"center" }}>
          
            <Lock size={24} style={{ marginRight: '8px' }} />
            Change Password
          </Typography>
          <form onSubmit={handleSubmit}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <TextField
                key={field}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name={field}
                label={field.split(/(?=[A-Z])/).join(' ')}
                type={showPassword[field] ? 'text' : 'password'}
                id={field}
                value={passwords[field]}
                onChange={handleChange(field)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword(field)}
                        edge="end"
                      >
                        {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={() => { setError(''); setSuccess(''); }}>
        <Alert onClose={() => { setError(''); setSuccess(''); }} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Info;