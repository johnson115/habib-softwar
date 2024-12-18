import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  IconButton, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { Menu, Plus, Home, HelpCircle, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SideDrawer = ({open, setOpen, activeProject, setActiveProject, onProjectChange}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const logo = require("../media/logo.jpeg");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost/projectapi.php/projects', {
        headers: { 'Authorization': token }
      });
      console.log('Fetched projects:', response.data);
      setProjects(Array.isArray(response.data) ? response.data : response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    }
  };

  const addProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/projectapi.php/projects', 
        { name: newProjectName },
        { headers: { 'Authorization': token }}
      );
      
      setProjects(prevProjects => [...prevProjects, response.data]);
      setDialogOpen(false);
      setNewProjectName('');
      setSnackbarMessage('Project added successfully!');
      setSnackbarOpen(true);
      if (onProjectChange) onProjectChange();
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.response?.data?.message || 'Failed to add project');
    }
  };

  const deleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost/projectapi.php?id=${projectId}`, {
          headers: { 'Authorization': token }
        });
        setProjects(projects.filter(project => project.id !== projectId));
        setSnackbarMessage('Project deleted successfully!');
        setSnackbarOpen(true);
        if (onProjectChange) onProjectChange();
        if (activeProject === projectId) {
          setActiveProject(null);
          navigate('/create-project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        setSnackbarMessage('Failed to delete project: ' + (error.response?.data?.message || error.message));
        setSnackbarOpen(true);
      }
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Info', icon: <HelpCircle size={20} /> },
  ];

  const selectProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost/projectapi.php/select-project', 
        { projectId },
        { headers: { 'Authorization': token }}
      );
      setActiveProject(projectId);
      navigate(`/home/${projectId}`);
    } catch (error) {
      console.error('Error selecting project:', error);
      setError('Failed to select project');
    }
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{ 
          position: 'fixed', 
          left: open ? (isMobile ? 240 : 280) : 20, 
          top: 20, 
          zIndex: 1200,
          transition: theme.transitions.create(['left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Menu size={24} color={theme.palette.primary.main} />
      </IconButton>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: isMobile ? 240 : 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? 240 : 280,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor:"#F3F3E0"
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="369 planner Logo"
              sx={{ width: 90, borderRadius: "50%", mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              369 Planner
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setDialogOpen(true)}
            sx={{
              mb: 2,
              bgcolor: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.secondary.dark
              },
              textTransform: 'none',
              borderRadius: '4px',
              width: '100%'
            }}
          >
            Add Project
          </Button>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, px: 2, fontWeight: 'bold' }}>
            Projects ({projects.length}/5)
          </Typography>
          
          <List sx={{ flexGrow: 1 }}>
            {projects.map((project) => (
              <ListItem 
                key={project.id}
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  bgcolor: project.id === activeProject ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  cursor:'pointer'
                }}
                onClick={() => selectProject(project.id)}
                button
              >
                <ListItemIcon>
                  <Home size={20} />
                </ListItemIcon>
                <ListItemText primary={project.name || `Project ${project.id}`} />
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                    navigate("/");
                    
                  }}
                  sx={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '.MuiListItem-root:hover &': {
                      opacity: 1
                    }
                  }}
                >
                  <X size={16} />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index}  onClick={() => navigate("/info")} sx={{ borderRadius: 1, mb: 1 , cursor:"pointer" }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem 
              button  
              sx={{ borderRadius: 1, mb: 1, cursor: "pointer" }}  
              onClick={() => {
                localStorage.removeItem('token');
                navigate("/login");
                
              }}
            >
              <ListItemIcon><LogOut size={20} /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>

          <Box sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="body2" sx={{textAlign:"center"}} color="text.secondary">
              You are Logged in 
            </Typography>
          </Box>
        </Box>
      </Drawer>

      <Dialog 
        open={dialogOpen} 
        onClose={() => {
          setDialogOpen(false);
          setError('');
          setNewProjectName('');
        }}
      >
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            error={!!error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            setError('');
            setNewProjectName('');
          }}>
            Cancel
          </Button>
          <Button onClick={addProject} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default SideDrawer;

