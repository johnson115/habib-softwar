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
import { Package, Layers, TrendingUp, Target, DollarSign, Clock, ArrowLeft, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MillionDollarMessage = () => {
  const [formData, setFormData] = useState({
    productName: {
      name: '',
    },
    productType: {
      type: '',
    },
    productValue: {
      value: '',
    },
    problemsSolved: {
      problems: '',
    },
    productPrice: {
      price: '',
    },
    deliveryTimeline: {
      timeline: '',
    }
  });

  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState({
    productName: false,
    productType: false,
    productValue: false,
    problemsSolved: false,
    productPrice: false,
    deliveryTimeline: false
  });
  const [formChanged, setFormChanged] = useState({
    productName: false,
    productType: false,
    productValue: false,
    problemsSolved: false,
    productPrice: false,
    deliveryTimeline: false
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
            step_name: 'millionDollar'
          },
          headers: { 'Authorization': token }
        });
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          const newCompletedForms = {};
          Object.keys(formData).forEach(section => {
            newCompletedForms[section] = response.data.data[section] && 
              Object.values(response.data.data[section]).every(value => value && value.trim() !== '');
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
          setCompletedForms(prev => ({
            ...prev,
            [section]: true
          }));
          setFormChanged(prev => ({
            ...prev,
            [section]: false
          }));
          setSnackbar({
            open: true,
            message: 'Saved successfully',
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

  const forms = [
    {
      id: 'productName',
      title: 'Your Product name',
      icon: <Package size={24} />,
      placeholder: 'Enter your product name',
      field: 'name'
    },
    {
      id: 'productType',
      title: 'Your product type',
      icon: <Layers size={24} />,
      placeholder: 'For example: coaching program, course, digital product, service',
      field: 'type'
    },
    {
      id: 'productValue',
      title: 'Value your product add to clients',
      icon: <TrendingUp size={24} />,
      placeholder: 'For example: increase sales, make successful ad campaigns, become better in their relationship with their partner',
      field: 'value'
    },
    {
      id: 'problemsSolved',
      title: 'Problems your product solves',
      icon: <Target size={24} />,
      placeholder: 'For example: my product will help my customer win their time, save on monthly fees, lose weight, and no more frustration',
      field: 'problems'
    },
    {
      id: 'productPrice',
      title: 'Your product price',
      icon: <DollarSign size={24} />,
      placeholder: 'Enter your product price',
      field: 'price'
    },
    {
      id: 'deliveryTimeline',
      title: 'Your product delivery timeline',
      icon: <Clock size={24} />,
      placeholder: 'Enter your product delivery timeline',
      field: 'timeline'
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
            Ultimate Message ® ({Object.values(completedForms).filter(Boolean).length}/6 completed)
          </Typography>
          
          <Grid container spacing={3}>
            {forms.map((form) => (
              <Grid item xs={12} md={4} key={form.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      {form.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {form.title} ®
                      </Typography>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label={form.placeholder}
                      multiline
                      rows={4}
                      value={formData[form.id]?.[form.field] || ''}
                      onChange={handleChange(form.id, form.field)}
                      sx={{ 
                        mb: 2,
                        '& .MuiInputLabel-root': {
                          whiteSpace: 'normal',
                          maxWidth: 'none'
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    
                    <Button 
                      variant="contained" 
                      onClick={() => handleSave(form.id)}
                      fullWidth
                      disabled={!formChanged[form.id] && completedForms[form.id] || isSaving}
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

export default MillionDollarMessage;

