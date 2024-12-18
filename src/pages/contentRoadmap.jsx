import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Sparkle, ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ContentRoadmap = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    coreProduct: {
      title: '',
      mdm: '',
      faqs: ''
    },
    stepOne: {
      title: '',
      mdm: '',
      faqs: ''
    },
    stepTwo: {
      title: '',
      mdm: '',
      faqs: ''
    },
    stepThree: {
      title: '',
      mdm: '',
      faqs: ''
    }
  });
  const [videoOpen, setVideoOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState({
    coreProduct: false,
    stepOne: false,
    stepTwo: false,
    stepThree: false
  });
  const [formChanged, setFormChanged] = useState({
    coreProduct: false,
    stepOne: false,
    stepTwo: false,
    stepThree: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost/projectdataapi.php`, {
          params: {
            project_id: projectId,
            step_name: 'contentRoadmap'
          },
          headers: { 'Authorization': token }
        });
        
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          
          const newCompletedForms = Object.keys(response.data.data).reduce((acc, key) => {
            acc[key] = Object.values(response.data.data[key]).every(value => value && value.trim() !== '');
            return acc;
          }, {});
          setCompletedForms(newCompletedForms);
        } else if (response.data.status === 'empty') {
          setSnackbar({
            open: true,
            message: 'No existing data found. Start filling out the form.',
            severity: 'info'
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading data. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleChange = (section, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value
      }
    }));
    setFormChanged(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const validateForm = (section) => {
    return Object.values(formData[section]).every(value => value.trim() !== '');
  };

  const handleSave = async (section) => {
    if (validateForm(section)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'contentRoadmap',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          const newCompletedForms = { ...completedForms, [section]: true };
          setCompletedForms(newCompletedForms);
          setFormChanged(prev => ({
            ...prev,
            [section]: false
          }));

          // Calculate actual progress based on completed forms
          const progress = Object.values(newCompletedForms).filter(Boolean).length;
          
          // Update progress in the database
          await axios.post('http://localhost/projectdataapi.php', {
            project_id: projectId,
            step_name: 'contentRoadmapProgress',
            data: { progress }
          }, {
            headers: { 'Authorization': token }
          });

          setSnackbar({
            open: true,
            message: saveResponse.data.message,
            severity: 'success'
          });
        } else {
          throw new Error(saveResponse.data.message);
        }
      } catch (error) {
        console.error('Error saving data:', error);
        setSnackbar({
          open: true,
          message: 'Error saving data. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields before saving.',
        severity: 'warning'
      });
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 240 : 280;

  const totalProgress = Object.values(completedForms).filter(Boolean).length;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const sections = [
    { id: 'coreProduct', title: 'CORE PRODUCT', icon: Sparkle },
    { id: 'stepOne', title: 'STEP ONE', icon: Sparkle },
    { id: 'stepTwo', title: 'STEP TWO', icon: Sparkle },
    { id: 'stepThree', title: 'STEP THREE', icon: Sparkle }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            })
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Play size={16} />}
              onClick={() => setVideoOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Watch Intro Video
            </Button>
          </Box>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(`/home/${projectId}`)}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
          
          <Typography variant="h4" sx={{ mb: 4 }}>
            Content Roadmap ® ({totalProgress}/4 completed)
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="One" />
              <Tab label="Two" />
              <Tab label="Three" />
            </Tabs>
          </Box>
          
          <Grid container spacing={3}>
            {sections.map((section, index) => (
              <Grid item xs={12} md={3} key={section.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  {index < 3 && (
                    <ArrowRight 
                      size={24} 
                      style={{
                        position: 'absolute',
                        right: -12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <section.icon size={24} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {section.title}
                      </Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="TITLE"
                      value={formData[section.id].title}
                      onChange={handleChange(section.id, 'title')}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="MDM"
                      multiline
                      rows={3}
                      value={formData[section.id].mdm}
                      onChange={handleChange(section.id, 'mdm')}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="FAQ'S"
                      multiline
                      rows={3}
                      value={formData[section.id].faqs}
                      onChange={handleChange(section.id, 'faqs')}
                      sx={{ mb: 2 }}
                    />
                    
                    <Button 
                      variant="contained" 
                      onClick={() => handleSave(section.id)}
                      fullWidth
                      disabled={!formChanged[section.id] && completedForms[section.id] || isSaving}
                    >
                      {isSaving ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ bgcolor: 'rgba(0,0,0,0.7)' }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'rgba(0,0,0,0.1)', aspectRatio: '16/9' }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <X size={16} />
          </IconButton>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/ND89A-g3EVI?si=wQomCK-VQ-eH6S66"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentRoadmap;
