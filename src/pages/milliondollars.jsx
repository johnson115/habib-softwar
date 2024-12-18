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
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Calculator, HandIcon as HandStop, Coins, ArrowLeft, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MillionDollarMessage = () => {
  const [formData, setFormData] = useState({
    calculator: {
      businessCategory: '',
      coreCurrency: '',
      increase: '',
      metricTimeline: ''
    },
    clientFilter: {
      willAccept: '',
      willReject: ''
    },
    message: {
      primaryGoal: '',
      primaryAspiration: '',
      topObstacles: '',
      millionDollarMessage: ''
    }
  });
  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState({
    calculator: false,
    clientFilter: false,
    message: false
  });
  const [formChanged, setFormChanged] = useState({
    calculator: false,
    clientFilter: false,
    message: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        console.log('Fetching data for project:', projectId);
        const response = await axios.get(`http://localhost/projectdataapi.php`, {
          params: {
            project_id: projectId,
            step_name: 'millionDollar'
          },
          headers: { 'Authorization': token }
        });
    
        console.log('Received data:', response.data);
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
      
          // Calculate completed forms based on saved data
          const newCompletedForms = {
            calculator: response.data.data.calculator && Object.values(response.data.data.calculator).every(value => value && value.trim() !== ''),
            clientFilter: response.data.data.clientFilter && Object.values(response.data.data.clientFilter).every(value => value && value.trim() !== ''),
            message: response.data.data.message && Object.values(response.data.data.message).every(value => value && value.trim() !== '')
          };
          setCompletedForms(newCompletedForms);
        } else if (response.data.status === 'empty') {
          setSnackbar({
            open: true,
            message: 'No existing data found. Start filling out the form.',
            severity: 'info'
          });
        }
      } catch (error) {
        console.error('Error loading data:', error.response ? error.response.data : error.message);
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

  useEffect(() => {
    // Update progress whenever completedForms changes
    const updateProgress = async () => {
      const progress = Object.values(completedForms).filter(Boolean).length;
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'millionDollarProgress',
          data: { progress }
        }, {
          headers: { 'Authorization': token }
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };
    
    updateProgress();
  }, [completedForms, projectId]);

  const handleChange = (section, field) => (event) => {
    const newFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: event.target.value
      }
    };
    
    setFormData(newFormData);
    setFormChanged(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const validateForm = (section) => {
    return formData[section] && Object.values(formData[section]).every(value => value && value.trim() !== '');
  };

  const handleSave = async (section) => {
    if (validateForm(section)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'millionDollar',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          // Update local completed forms state
          const newCompletedForms = {
            ...completedForms,
            [section]: true
          };
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
            step_name: 'millionDollarProgress',
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
          message: `Error saving data: ${error.message}`,
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
            Million Dollar Message ® ({Object.values(completedForms).filter(Boolean).length}/3 completed)
          </Typography>
          
          <Grid container spacing={3}>
            {/* Calculator Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Calculator size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      CALCULATOR ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="MY BUSINESS CATEGORY"
                    value={formData.calculator?.businessCategory || ''}
                    onChange={handleChange('calculator', 'businessCategory')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="MY CORE CURRENCY IS"
                    value={formData.calculator?.coreCurrency || ''}
                    onChange={handleChange('calculator', 'coreCurrency')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="INCREASE"
                    value={formData.calculator?.increase || ''}
                    onChange={handleChange('calculator', 'increase')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="METRIC + TIMELINE"
                    value={formData.calculator?.metricTimeline || ''}
                    onChange={handleChange('calculator', 'metricTimeline')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('calculator')}
                    fullWidth
                    disabled={!formChanged.calculator && completedForms.calculator || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Client Filter Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HandStop size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      NEW CLIENT FILTER ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="WHO WILL YOU ACCEPT"
                    multiline
                    rows={4}
                    value={formData.clientFilter?.willAccept || ''}
                    onChange={handleChange('clientFilter', 'willAccept')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="WHO WILL REJECT"
                    multiline
                    rows={4}
                    value={formData.clientFilter?.willReject || ''}
                    onChange={handleChange('clientFilter', 'willReject')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('clientFilter')}
                    fullWidth
                    disabled={!formChanged.clientFilter && completedForms.clientFilter || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Million Dollar Message Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Coins size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      MILLION DOLLAR MESSAGE ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="PRIMARY GOAL"
                    multiline
                    rows={3}
                    value={formData.message?.primaryGoal || ''}
                    onChange={handleChange('message', 'primaryGoal')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="PRIMARY ASPIRATION"
                    multiline
                    rows={3}
                    value={formData.message?.primaryAspiration || ''}
                    onChange={handleChange('message', 'primaryAspiration')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="TOP 3 OBSTACLES"
                    multiline
                    rows={3}
                    value={formData.message?.topObstacles || ''}
                    onChange={handleChange('message', 'topObstacles')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="YOUR MILLION DOLLAR MESSAGE"
                    multiline
                    rows={3}
                    value={formData.message?.millionDollarMessage || ''}
                    onChange={handleChange('message', 'millionDollarMessage')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('message')}
                    fullWidth
                    disabled={!formChanged.message && completedForms.message || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
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

export default MillionDollarMessage;

