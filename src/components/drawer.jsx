import React from 'react';
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
  useTheme
} from '@mui/material';
import { Menu, Plus, Home,  HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SideDrawer = ({open , setOpen}) => {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setOpen(!open);
  };
const navigate=useNavigate();
  const logo = require("../media/logo.jpeg");

  const menuItems = [
    { text: 'Habib', icon: <Home size={20} /> },
   
    { text: 'Help', icon: <HelpCircle size={20} /> },
  ];

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
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="Launch Maps Logo"
              sx={{ width: 90, borderRadius: "50%", mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              LAUNCH MAPS
            </Typography>
          </Box>

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
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
            Add Campaign
          </Button>

         

          {/* Navigation Menu */}
          <List sx={{ flexGrow: 1, mt: 2 }}>
            {menuItems.map((item, index) => (
              <ListItem button key={index} sx={{ borderRadius: 1, mb: 1 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button  sx={{ borderRadius: 1, mb: 1 ,cursor:"pointer"}}  onClick={()=>{
              localStorage.removeItem('token');
              navigate("/login")
            }}>
            <ListItemIcon><LogOut size={20} /></ListItemIcon>
            <ListItemText primary="Logout" />
            </ListItem>
          </List>

          {/* User Info */}
          <Box sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Logged in as: John Doe
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;