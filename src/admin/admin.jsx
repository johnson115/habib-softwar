import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { Trash2, UserPlus } from 'lucide-react';
import axios from 'axios';

const GlobalAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    } else {
      setisLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Authentication status:', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      const response = await axios.post('http://localhost/api.php/admin/login', {
        username,
        password,
      });
      console.log('Login response:', response);

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        setIsAuthenticated(true);
        setSnackbar({
          open: true,
          message: 'Logged in successfully',
          severity: 'success',
        });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Invalid username or password',
        severity: 'error',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost/api.php/admin/users', {
        headers: {
          'x-auth-token': token,
        },
      });

      console.log('API Response:', response);

      setisLoading(false);

      if (response.data.data) {
        setUsers(response.data.data);
      } else {
        throw new Error('No users data found in response');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching users. Please try again.',
        severity: 'error',
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`http://localhost/delete.php/admin/users/${userId}`, {
        headers: { 'x-auth-token': token },
      });
      if (response.data.success) {
        fetchUsers();
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error.response || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting user. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost/api.php/admin/users', newUser, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        fetchUsers(); // Refresh the users list
        setIsAddUserDialogOpen(false);
        setNewUser({ username: '', email: '', password: '' });
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding user. Please try again.',
        severity: 'error',
      });
    }
  };

if(isLoading){
  return(
    <h1 style={{textAlign:'center' , color:'white' , marginLeft:'auto' , marginRight:"auto" , marginTop:'200px'}}>Wait few seconds . . .</h1>
  )
}

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>Global Admin Login</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
            required
          />
          <Button 
            variant="contained" 
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "block" ,m:4, maxHeight:100,}}>
      <Typography variant="h4" sx={{textAlign:"center" , color:"white"}} gutterBottom>Global Admin Dashboard</Typography>
      <Button
        variant="contained"
        startIcon={<UserPlus size={20} />}
        onClick={() => setIsAddUserDialogOpen(true)}
        sx={{ mb: 2 , backgroundColor:"#001A6E" }}
      >
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"#001A6E"}} >
            <TableRow>
              <TableCell sx={{color:"white" , textAlign:"center"}} >Username</TableCell>
              <TableCell sx={{color:"white" , textAlign:"center"}} >Email</TableCell>
              <TableCell sx={{color:"white" , textAlign:"center"}} >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{backgroundColor:"#C8ACD6"}}>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}  >
                  <TableCell sx={{ textAlign:"center"}}>{user.username}</TableCell>
                  <TableCell sx={{ textAlign:"center"}}>{user.email}</TableCell>
                  <TableCell>
                    <IconButton  onClick={() => handleDeleteUser(user.id)}>
                      <Trash2  color='red' size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog  open={isAddUserDialogOpen} onClose={() => setIsAddUserDialogOpen(false)}>
        <div style={{backgroundColor:"#001A6E"}}>
        <DialogTitle sx={{color:"white" , textAlign:"center"}} >Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            sx={{backgroundColor:"#ffff"}}
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            sx={{backgroundColor:"#ffff"}}
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            sx={{backgroundColor:"#ffff"}}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{color:"white"}} onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
          <Button sx={{color:"white"}} onClick={handleAddUser} disabled={!newUser.username || !newUser.email || !newUser.password}>Add</Button>
        </DialogActions>
        </div> 
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GlobalAdminPage;

