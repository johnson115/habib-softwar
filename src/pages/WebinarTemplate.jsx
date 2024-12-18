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
import { Presentation, Target, Lightbulb, MessageCircle, Gift, Shield, ArrowLeft, Play, X } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const WebinarTemplate = () => {
  const [formData, setFormData] = useState({
    webinarBigPicture: {
      endOffer: '',
      problems: ['', '', ''],
      secrets: ['', '', ''],
      webinarName: ''
    },
    ultimateFramework: {
      problemsImpact: '',
      secretsImpact: '',
      teachingStories: ''
    },
    pitch: {
      offerStack: ['', '', '', '', '', '', ''],
      earlyAdopterOffer: '',
      guarantee: ''
    }
  });
  
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [completedForms, setCompletedForms] = useState({
    webinarBigPicture: false,
    ultimateFramework: false,
    pitch: false
  });
  const [formChanged, setFormChanged] = useState({
    webinarBigPicture: false,
    ultimateFramework: false,
    pitch: false
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
            step_name: 'webinarTemplate'
          },
          headers: { 'Authorization': token }
        });
    
        if (response.data.status === 'success') {
          setFormData(response.data.data);
          const newCompletedForms = {
            webinarBigPicture: response.data.data.webinarBigPicture && 
              response.data.data.webinarBigPicture.endOffer &&
              response.data.data.webinarBigPicture.problems.every(p => p.trim() !== '') &&
              response.data.data.webinarBigPicture.secrets.every(s => s.trim() !== '') &&
              response.data.data.webinarBigPicture.webinarName,
            ultimateFramework: response.data.data.ultimateFramework &&
              Object.values(response.data.data.ultimateFramework).every(value => value && value.trim() !== ''),
            pitch: response.data.data.pitch &&
              response.data.data.pitch.offerStack.every(o => o.trim() !== '') &&
              response.data.data.pitch.earlyAdopterOffer &&
              response.data.data.pitch.guarantee
          };
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

  const handleChange = (formType, field, index = null) => (event) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (Array.isArray(newData[formType][field])) {
        newData[formType][field] = [...newData[formType][field]];
        newData[formType][field][index] = event.target.value;
      } else {
        newData[formType][field] = event.target.value;
      }
      return newData;
    });
    setFormChanged(prev => ({
      ...prev,
      [formType]: true
    }));
  };

  const validateForm = (formType) => {
    const form = formData[formType];
    if (formType === 'webinarBigPicture') {
      return form.endOffer.trim() !== '' &&
        form.problems.every(p => p.trim() !== '') &&
        form.secrets.every(s => s.trim() !== '') &&
        form.webinarName.trim() !== '';
    } else if (formType === 'ultimateFramework') {
      return Object.values(form).every(value => value && value.trim() !== '');
    } else if (formType === 'pitch') {
      return form.offerStack.every(o => o.trim() !== '') &&
        form.earlyAdopterOffer.trim() !== '' &&
        form.guarantee.trim() !== '';
    }
    return false;
  };

  const handleSave = async (formType) => {
    if (validateForm(formType)) {
      try {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        const saveResponse = await axios.post('http://localhost/projectdataapi.php', {
          project_id: projectId,
          step_name: 'webinarTemplate',
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
            message: 'Webinar template saved successfully',
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

  const tabs = [
    { key: 'webinarBigPicture', label: 'Webinar Big Picture', icon: <Presentation size={24} /> },
    { key: 'ultimateFramework', label: 'Ultimate Framework', icon: <Lightbulb size={24} /> },
    { key: 'pitch', label: 'Your Pitch', icon: <MessageCircle size={24} /> }
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
            Webinar Template ® ({Object.values(completedForms).filter(Boolean).length}/3 completed)
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

          {/* Webinar Big Picture Form */}
          <Box hidden={activeTab !== 0} role="tabpanel">
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Target size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          What we will offer at the end of the webinar ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.webinarBigPicture.endOffer}
                        onChange={handleChange('webinarBigPicture', 'endOffer')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Target size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          Target avatar 3 problems we'll solve inside this webinar ®
                        </Typography>
                      </Box>
                      {[0, 1, 2].map((index) => (
                        <TextField
                          key={index}
                          fullWidth
                          multiline
                          rows={3}
                          label={`Problem ${index + 1}`}
                          value={formData.webinarBigPicture.problems[index]}
                          onChange={handleChange('webinarBigPicture', 'problems', index)}
                          sx={{ mb: 2 }}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Lightbulb size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          3 secrets we'll use to solve those problems ®
                        </Typography>
                      </Box>
                      {[0, 1, 2].map((index) => (
                        <TextField
                          key={index}
                          fullWidth
                          multiline
                          rows={3}
                          label={`Secret ${index + 1}`}
                          value={formData.webinarBigPicture.secrets[index]}
                          onChange={handleChange('webinarBigPicture', 'secrets', index)}
                          sx={{ mb: 2 }}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Presentation size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          Webinar name ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        value={formData.webinarBigPicture.webinarName}
                        onChange={handleChange('webinarBigPicture', 'webinarName')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('webinarBigPicture')}
                    fullWidth
                    disabled={!formChanged.webinarBigPicture && completedForms.webinarBigPicture || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save Webinar Big Picture'}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Ultimate Framework Form */}
          <Box hidden={activeTab !== 1} role="tabpanel">
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Target size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          The impact of the 3 core problems your clients face ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.ultimateFramework.problemsImpact}
                        onChange={handleChange('ultimateFramework', 'problemsImpact')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Lightbulb size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          The impact of your 3 secrets that solve those problems ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.ultimateFramework.secretsImpact}
                        onChange={handleChange('ultimateFramework', 'secretsImpact')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <MessageCircle size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          What stories you will use to teach your 3 secrets ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.ultimateFramework.teachingStories}
                        onChange={handleChange('ultimateFramework', 'teachingStories')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('ultimateFramework')}
                    fullWidth
                    disabled={!formChanged.ultimateFramework && completedForms.ultimateFramework || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save Ultimate Framework'}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Pitch Form */}
          <Box hidden={activeTab !== 2} role="tabpanel">
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Gift size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          Your Offer stack (What you offer to your clients) ®
                        </Typography>
                      </Box>
                      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                        <TextField
                          key={index}
                          fullWidth
                          multiline
                          rows={2}
                          label={`Offer ${index + 1}`}
                          value={formData.pitch.offerStack[index]}
                          onChange={handleChange('pitch', 'offerStack', index)}
                          sx={{ mb: 2 }}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Gift size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          What special offer for early adopters ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.pitch.earlyAdopterOffer}
                        onChange={handleChange('pitch', 'earlyAdopterOffer')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Shield size={24} />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          What guarantee do you offer ®
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.pitch.guarantee}
                        onChange={handleChange('pitch', 'guarantee')}
                        sx={{ mb: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('pitch')}
                    fullWidth
                    disabled={!formChanged.pitch && completedForms.pitch || isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save Pitch'}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
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

export default WebinarTemplate;

