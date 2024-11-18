import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, LinearProgress, Typography, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import SideDrawer from '../components/drawer';
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 240 : 280;
  const [perfectAvatarProgress, setPerfectAvatarProgress] = useState(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem('perfectAvatarProgress');
    if (savedProgress) {
      setPerfectAvatarProgress(parseInt(savedProgress, 10));
    }
  }, []);

  const steps = [
    {
      title: "Perfect Avatar",
      icon: "👤",
      step: 1,
      progress: perfectAvatarProgress,
      total: 3,
      dir:"/perfect-avatar"
    },
    {
      title: "Million Dollar Message",
      icon: "💰",
      step: 2,
      progress: 0,
      total: 3
    },
    {
      title: "Perfect Offer",
      icon: "💎",
      step: 3,
      progress: 0,
      total: 7
    },
    {
      title: "Ultimate Lead Magnet",
      icon: "🧲",
      step: 4,
      progress: 0,
      total: 10
    },
    {
      title: "Authority Amplifier",
      icon: "📢",
      step: 5,
      progress: 0,
      total: 30
    },
    {
      title: "10x Enrollment Script",
      icon: "📝",
      step: 6,
      progress: 0,
      total: 6
    },
    {
      title: "Content Roadmap",
      icon: "📅",
      step: 7,
      progress: 0,
      total: 10
    },
    {
      title: "Traffic on Demand",
      icon: "🔄",
      step: 8,
      progress: 0,
      total: 10
    },
    {
      title: "Retargetting Roadmap",
      icon: "🎯",
      step: 9,
      progress: 0,
      total: 10
    }
  ];

  return (
    <>
      <SideDrawer open={open} setOpen={setOpen} />
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: open ? `${drawerWidth}px` : 0 },
            bgcolor: 'grey.100',
            minHeight: '100vh',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box sx={{ mb: 4, mt: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Campaign Dashboard
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid item xs={12} sm={6} md={4} key={step.step}>
                <Link to={step.dir} style={{ textDecoration: 'none' }}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative', 
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-4px)'
                    }, 
                    transition: 'box-shadow 0.3s, transform 0.3s'
                  }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                      <Mail size={20} color={theme.palette.text.secondary} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="h4" component="span" mr={2}>
                          {step.icon}
                        </Typography>
                        <Box flexGrow={1}>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {step.title} ®
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <LinearProgress 
                              variant="determinate" 
                              value={(step.progress / step.total) * 100} 
                              sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {step.progress}/{step.total}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Step {step.step}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;