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
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Tag, MessageCircle, ListChecks, DollarSign, Gift, TrendingUp, ArrowLeft, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BusinessEngine = () => {
  const initialFormState = {
    name: '',
    steps: '',
    ultimateMessage: '',
    price: '',
    orderbump: '',
    upsell: ''
  };

  const [formData, setFormData] = useState({
    lowTicket: { ...initialFormState },
    midTicket: { ...initialFormState },
    highTicket: { ...initialFormState }
  });
  
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [completedForms, setCompletedForms] = useState({
    lowTicket: false,
    midTicket: false,
    highTicket: false
  });
  const [formChanged, setFormChanged] = useState({
    lowTicket: false,
    midTicket: false,
    highTicket: false
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
        const response = await axios.get(`http://localhost/projectdataapi.php`, {
          params: {
            project_id: projectId,
            step_name: 'businessEngine'
          },
          headers: { 'Authorization': token }
        });
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          const newCompletedForms = {};
          Object.keys(response.data.data).forEach(form => {
            newCompletedForms[form] = Object.values(response.data.data[form]).every(value => value && value.trim() !== '');
          });
          setCompletedForms(newCompletedForms);
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

  const handleChange = (formType, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: event.target.value
      }
    }));
    setFormChanged(prev => ({
      ...prev,
      [formType]: true
    }));
  };

  const validateForm = (formType) => {
    return Object.values(formData[formType]).every(value => value && value.trim() !== '');
  };

  const handleSave = async (formType) => {
    if (validateForm(formType)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'businessEngine',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          setCompletedForms(prev => ({
            ...prev,
            [formType]: true
          }));
          setFormChanged(prev => ({
            ...prev,
            [formType]: false
          }));

          setSnackbar({
            open: true,
            message: 'Offer saved successfully',
            severity: 'success'
          });
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const formFields = [
    {
      id: 'name',
      label: 'Name',
      icon: <Tag size={24} />
    },
    {
      id: 'steps',
      label: 'Steps',
      icon: <ListChecks size={24} />
    },
    {
      id: 'ultimateMessage',
      label: 'Ultimate Message',
      icon: <MessageCircle size={24} />
    },
    {
      id: 'price',
      label: 'Price',
      icon: <DollarSign size={24} />
    },
    {
      id: 'orderbump',
      label: 'Orderbump',
      icon: <Gift size={24} />
    },
    {
      id: 'upsell',
      label: 'Upsell',
      icon: <TrendingUp size={24} />
    }
  ];

  const tabs = [
    { key: 'lowTicket', label: 'Low Ticket Offer' },
    { key: 'midTicket', label: 'Mid Ticket Offer' },
    { key: 'highTicket', label: 'High Ticket Offer' }
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
            minHeight: '100vh'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Play size={16} />}
              onClick={() => setVideoOpen(true)}
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
            Business Engine Mechanism ® ({Object.values(completedForms).filter(Boolean).length}/3 completed)
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              {tabs.map((tab, index) => (
                <Tab 
                  key={tab.key} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      {completedForms[tab.key] && (
                        <Typography variant="caption" color="success.main">
                          (Completed)
                        </Typography>
                      )}
                    </Box>
                  } 
                />
              ))}
            </Tabs>
          </Box>

          {tabs.map((tab, index) => (
            <Box
              key={tab.key}
              role="tabpanel"
              hidden={activeTab !== index}
            >
              {activeTab === index && (
                <Grid container spacing={3}>
                  {formFields.map((field) => (
                    <Grid item xs={12} md={6} key={field.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            {field.icon}
                            <Typography variant="h6" sx={{ ml: 1 }}>
                              {field.label} ®
                            </Typography>
                          </Box>
                          
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={formData[tab.key][field.id] || ''}
                            onChange={handleChange(tab.key, field.id)}
                            sx={{ mb: 2 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      onClick={() => handleSave(tab.key)}
                      fullWidth
                      disabled={!formChanged[tab.key] && completedForms[tab.key] || isSaving}
                    >
                      {isSaving ? <CircularProgress size={24} /> : `Save ${tab.label}`}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative', aspectRatio: '16/9' }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
          >
            <X size={16} />
          </IconButton>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/ND89A-g3EVI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessEngine;

