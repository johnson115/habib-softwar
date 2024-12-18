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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Footprints, AlertTriangle, ListChecks, HelpCircle, TrendingUp, CheckSquare, Target, MessageCircle, ChevronDown, ArrowLeft, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MatrixRoadmap = () => {
  // Initialize state for 9 forms
  const initialFormState = {
    stepName: '',
    struggles: '',
    stepOutline: '',
    questions: '',
    benefits: '',
    actions: '',
    results: '',
    ultimateMessage: ''
  };

  const [formData, setFormData] = useState(Array(9).fill(null).map(() => ({...initialFormState})));
  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState(Array(9).fill(false));
  const [formChanged, setFormChanged] = useState(Array(9).fill(false));
  const [expandedForm, setExpandedForm] = useState(0);
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
            step_name: 'matrixRoadmap'
          },
          headers: { 'Authorization': token }
        });
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          const newCompletedForms = response.data.data.map(form => 
            Object.values(form).every(value => value && value.trim() !== '')
          );
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

  const handleChange = (formIndex, field) => (event) => {
    const newFormData = [...formData];
    newFormData[formIndex] = {
      ...newFormData[formIndex],
      [field]: event.target.value
    };
    
    setFormData(newFormData);
    const newFormChanged = [...formChanged];
    newFormChanged[formIndex] = true;
    setFormChanged(newFormChanged);
  };

  const validateForm = (formIndex) => {
    return Object.values(formData[formIndex]).every(value => value && value.trim() !== '');
  };

  const handleSave = async (formIndex) => {
    if (validateForm(formIndex)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'matrixRoadmap',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          const newCompletedForms = [...completedForms];
          newCompletedForms[formIndex] = true;
          setCompletedForms(newCompletedForms);
          
          const newFormChanged = [...formChanged];
          newFormChanged[formIndex] = false;
          setFormChanged(newFormChanged);

          setSnackbar({
            open: true,
            message: 'Step saved successfully',
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
      id: 'stepName',
      label: 'Your step name',
      icon: <Footprints size={24} />
    },
    {
      id: 'struggles',
      label: 'Top three struggles my clients run into when going through this step',
      icon: <AlertTriangle size={24} />
    },
    {
      id: 'stepOutline',
      label: 'Step Outline',
      icon: <ListChecks size={24} />
    },
    {
      id: 'questions',
      label: 'The top 3 questions my audience might ask in this step',
      icon: <HelpCircle size={24} />
    },
    {
      id: 'benefits',
      label: 'What benefits this step will increase and decrease',
      icon: <TrendingUp size={24} />
    },
    {
      id: 'actions',
      label: 'List the 3 actions in this step',
      icon: <CheckSquare size={24} />
    },
    {
      id: 'results',
      label: 'The results will achieve',
      icon: <Target size={24} />
    },
    {
      id: 'ultimateMessage',
      label: "This step's ultimate message",
      icon: <MessageCircle size={24} />
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
            3:6:9 Matrix Roadmap ® ({completedForms.filter(Boolean).length}/9 completed)
          </Typography>

          {Array(9).fill(null).map((_, formIndex) => (
            <Accordion 
              key={formIndex}
              expanded={expandedForm === formIndex}
              onChange={() => setExpandedForm(expandedForm === formIndex ? -1 : formIndex)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">
                    Step {formIndex + 1}
                  </Typography>
                  {completedForms[formIndex] && (
                    <Typography variant="body2" color="success.main">
                      Completed
                    </Typography>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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
                            value={formData[formIndex][field.id] || ''}
                            onChange={handleChange(formIndex, field.id)}
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
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      onClick={() => handleSave(formIndex)}
                      fullWidth
                      disabled={!formChanged[formIndex] && completedForms[formIndex] || isSaving}
                    >
                      {isSaving ? <CircularProgress size={24} /> : 'Save Step'}
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
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

export default MatrixRoadmap;

