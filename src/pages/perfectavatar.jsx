import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Target, Camera, Goal, ArrowLeft, Play, X, Users, Calendar, Trophy, Briefcase, HelpCircle } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PerfectAvatar = () => {
  const [formData, setFormData] = useState({
  clientGender: {
    gender: '',
  },
  clientAge: {
    age: '',
  },
  clientsCoreProblem: {
    Your_clients_core_problem: '',
  },
  clients_ultimate_goal: {
    Your_clients_ultimate_goal: '',
  },
  clientsNiche: {
    Your_clients_Niche: '',
  },
  frustrated_questions_before_bed_time: {
    Your_frustrated_question_for_clients_before_bed_time: '',
  }
});
  const [open, setOpen] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [completedForms, setCompletedForms] = useState({
  clientGender: false,
  clientAge: false,
  clientsCoreProblem: false,
  clients_ultimate_goal: false,
  clientsNiche: false,
  frustrated_questions_before_bed_time: false
});
  const [formChanged, setFormChanged] = useState({
  clientGender: false,
  clientAge: false,
  clientsCoreProblem: false,
  clients_ultimate_goal: false,
  clientsNiche: false,
  frustrated_questions_before_bed_time: false
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
        console.log('Fetching data for project:', projectId);
        const response = await axios.get(`http://localhost/projectdataapi.php`, {
          params: {
            project_id: projectId,
            step_name: 'perfectAvatar'
          },
          headers: { 'Authorization': token }
        });
    
        console.log('Received data:', response.data);
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
      
          // Calculate completed forms based on saved data
          const newCompletedForms = {
            clientGender: response.data.data.clientGender && Object.values(response.data.data.clientGender).every(value => value && value.trim() !== ''),
            clientAge: response.data.data.clientAge && Object.values(response.data.data.clientAge).every(value => value && value.trim() !== ''),
            clientsCoreProblem: response.data.data.clientsCoreProblem && Object.values(response.data.data.clientsCoreProblem).every(value => value && value.trim() !== ''),
            clients_ultimate_goal: response.data.data.clients_ultimate_goal && Object.values(response.data.data.clients_ultimate_goal).every(value => value && value.trim() !== ''),
            clientsNiche: response.data.data.clientsNiche && Object.values(response.data.data.clientsNiche).every(value => value && value.trim() !== ''),
            frustrated_questions_before_bed_time: response.data.data.frustrated_questions_before_bed_time && Object.values(response.data.data.frustrated_questions_before_bed_time).every(value => value && value.trim() !== '')
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
    if (section === 'clientGender' || section === 'clientAge') {
      return formData[section] && Object.values(formData[section]).every(value => value && value.trim() !== '');
    }
    return formData[section] && Object.values(formData[section]).every(value => value && value.trim() !== '');
  };

  const handleSave = async (section) => {
    if (validateForm(section)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'perfectAvatar',
          data: formData
        }, {
          headers: { 'Authorization': token }
        });

        if (saveResponse.data.status === 'success') {
          const newCompletedForms = {
            ...completedForms,
            [section]: true
          };
          setCompletedForms(newCompletedForms);
        
          setFormChanged(prev => ({
            ...prev,
            [section]: false
          }));

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
            bgcolor: '#f3f3e0',
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
            Perfect Avatar ® ({Object.values(completedForms).filter(Boolean).length}/6 completed)
          </Typography>
          
          <Grid container spacing={3}>
            {/* Client Gender Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Users size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Client Gender ®
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Select client gender:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant={formData.clientGender?.gender === 'male' ? 'contained' : 'outlined'}
                        onClick={() => handleChange('clientGender', 'gender')({ target: { value: 'male' } })}
                      >
                        Male
                      </Button>
                      <Button
                        variant={formData.clientGender?.gender === 'female' ? 'contained' : 'outlined'}
                        onClick={() => handleChange('clientGender', 'gender')({ target: { value: 'female' } })}
                      >
                        Female
                      </Button>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('clientGender')}
                    fullWidth
                    disabled={!formChanged.clientGender && completedForms.clientGender || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Client Age Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Calendar size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Client Age ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Client age (your client age range for EXP: 25-35)"
                    type="text"
                    value={formData.clientAge?.age || ''}
                    onChange={handleChange('clientAge', 'age')}
                    sx={{ 
                        mb: 2,
                        '& .MuiInputLabel-root': {
                          whiteSpace: 'normal',
                          maxWidth: 'none',
                          paddingBottom:'20px',
                        }
                      }}
                      InputLabelProps={{
                        shrink: true,
                        

                      }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('clientAge')}
                    fullWidth
                    disabled={!formChanged.clientAge && completedForms.clientAge || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Avatar client CORE PROBLEME */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Target size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                    Your client's core problem ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="(what's the number 1 problem of your client) "
                    multiline
                    rows={3}
                    value={formData.clientsCoreProblem?.Your_clients_core_problem || ''}
                    onChange={handleChange('clientsCoreProblem', 'Your_clients_core_problem')}
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
                    onClick={() => handleSave('clientsCoreProblem')}
                    fullWidth
                    disabled={!formChanged.clientsCoreProblem && completedForms.clientsCoreProblem || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            
            {/* Avatar client  ultimate goal */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Trophy size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                    Your client's ultimate goal ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="(what's the number 1 goal your client wants to achieve) "
                    multiline
                    rows={3}
                    value={formData.clients_ultimate_goal?.Your_clients_ultimate_goal || ''}
                    onChange={handleChange('clients_ultimate_goal', 'Your_clients_ultimate_goal')}
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
                    onClick={() => handleSave('clients_ultimate_goal')}
                    fullWidth
                    disabled={!formChanged.clients_ultimate_goal && completedForms.clients_ultimate_goal || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

             {/* Avatar client's Niche */}
             <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Briefcase size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                    Your client's Niche  ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="(what industry is your client in? For EXP: coaches and consultants)"
                    multiline
                    rows={3}
                    value={formData.clientsNiche?.Your_clients_Niche || ''}
                    onChange={handleChange('clientsNiche', 'Your_clients_Niche')}
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
                    onClick={() => handleSave('clientsNiche')}
                    fullWidth
                    disabled={!formChanged.clientsNiche && completedForms.clientsNiche || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>


            {/* Avatar Goals Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HelpCircle size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                    The questions that make your client frustrated before bedtime . ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="(what's the number 1 thing that makes your client frustrated before bedtime, at 3 am and first time in the morning (for example: how to make my ads profitable)."
                    multiline
                    rows={3}
                    value={formData.frustrated_questions_before_bed_time?.Your_frustrated_question_for_clients_before_bed_time || ''}
                    onChange={handleChange('frustrated_questions_before_bed_time', 'Your_frustrated_question_for_clients_before_bed_time')}
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
                    onClick={() => handleSave('frustrated_questions_before_bed_time')}
                    fullWidth
                    disabled={!formChanged.frustrated_questions_before_bed_time && completedForms.frustrated_questions_before_bed_time || isSaving}
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

export default PerfectAvatar;

