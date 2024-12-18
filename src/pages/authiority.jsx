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
  Snackbar,
  Alert, 
  Dialog, 
  DialogContent, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { Frame, FileText, Clapperboard, ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AuthorityAmplifier = () => {
  const [formData, setFormData] = useState({
    framingPhase: {
      title: '',
      promise: '',
      proof: ''
    },
    contentPhase: {
      problems: '',
      steps: ''
    },
    actionPhase: {
      context: '',
      action: ''
    }
  });
  const [videoOpen, setVideoOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState({
    framingPhase: false,
    contentPhase: false,
    actionPhase: false
  });
  const [formChanged, setFormChanged] = useState({
    framingPhase: false,
    contentPhase: false,
    actionPhase: false
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
            step_name: 'authorityAmplifier'
          },
          headers: { 'Authorization': token }
        });
        
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          
          const newCompletedForms = {
            framingPhase: response.data.data.framingPhase && Object.values(response.data.data.framingPhase).every(value => value && value.trim() !== ''),
            contentPhase: response.data.data.contentPhase && Object.values(response.data.data.contentPhase).every(value => value && value.trim() !== ''),
            actionPhase: response.data.data.actionPhase && Object.values(response.data.data.actionPhase).every(value => value && value.trim() !== '')
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

  const handleChange = (phase, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        [field]: event.target.value
      }
    }));
    setFormChanged(prev => ({
      ...prev,
      [phase]: true
    }));
  };

  const validateForm = (phase) => {
    return Object.values(formData[phase]).every(value => value.trim() !== '');
  };

  const handleSave = async (phase) => {
    if (validateForm(phase)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'authorityAmplifier',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          const newCompletedForms = { ...completedForms, [phase]: true };
          setCompletedForms(newCompletedForms);
          setFormChanged(prev => ({
            ...prev,
            [phase]: false
          }));

          const progress = Object.values(newCompletedForms).filter(Boolean).length;
          await axios.post('http://localhost/projectdataapi.php', {
            project_id: projectId,
            step_name: 'authorityAmplifierProgress',
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

  const phases = [
    { id: 'framingPhase', title: 'FRAMING PHASE', icon: Frame, fields: ['title', 'promise', 'proof'] },
    { id: 'contentPhase', title: 'CONTENT PHASE', icon: FileText, fields: ['problems', 'steps'] },
    { id: 'actionPhase', title: 'ACTION PHASE', icon: Clapperboard, fields: ['context', 'action'] }
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
            Authority Amplifier ® ({totalProgress}/3 completed)
          </Typography>
          
          <Grid container spacing={3}>
            {phases.map((phase, index) => (
              <Grid item xs={12} md={4} key={phase.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  {index < 2 && (
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
                      <phase.icon size={24} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {phase.title}
                      </Typography>
                    </Box>
                    
                    {phase.fields.map(field => (
                      <TextField
                        key={field}
                        fullWidth
                        label={field.toUpperCase()}
                        multiline
                        rows={3}
                        value={formData[phase.id][field]}
                        onChange={handleChange(phase.id, field)}
                        sx={{ mb: 2 }}
                      />
                    ))}
                    
                    <Button 
                      variant="contained" 
                      onClick={() => handleSave(phase.id)}
                      fullWidth
                      disabled={!formChanged[phase.id] && completedForms[phase.id] || isSaving}
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

export default AuthorityAmplifier;

