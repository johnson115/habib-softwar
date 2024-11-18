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
  useMediaQuery
} from '@mui/material';
import { Target, Camera, Goal, ArrowLeft, Download } from 'lucide-react';
import SideDrawer from '../components/drawer';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

const PerfectAvatar = () => {
  const [formData, setFormData] = useState({
    targetMarket: {
      passion: '',
      profit: '',
      problems: ''
    },
    avatarSnapshot: {
      overview: '',
      whoTheyAre: '',
      whatTheyDo: '',
      whereTheyAre: ''
    },
    avatarGoals: {
      currentGoals: '',
      longTermAspirations: '',
      currentObstacles: '',
      longTermFears: ''
    }
  });
  const [open, setOpen] = useState(true);
  const [completedForms, setCompletedForms] = useState({
    targetMarket: false,
    avatarSnapshot: false,
    avatarGoals: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('perfectAvatarData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    const savedCompletedForms = localStorage.getItem('perfectAvatarCompletedForms');
    if (savedCompletedForms) {
      setCompletedForms(JSON.parse(savedCompletedForms));
    }
  }, []);

  const handleChange = (section, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value
      }
    }));
  };

  const validateForm = (section) => {
    return Object.values(formData[section]).every(value => value.trim() !== '');
  };

  const handleSave = (section) => {
    if (validateForm(section)) {
      localStorage.setItem('perfectAvatarData', JSON.stringify(formData));
      const newCompletedForms = { ...completedForms, [section]: true };
      setCompletedForms(newCompletedForms);
      localStorage.setItem('perfectAvatarCompletedForms', JSON.stringify(newCompletedForms));
      console.log(`Saving ${section}:`, formData[section]);
      generatePDF(section);
    } else {
      alert('Please fill in all fields before saving.');
    }
  };

  const generatePDF = (section) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}`, 10, 10);
    doc.setFontSize(12);
    let yPos = 30;
    Object.entries(formData[section]).forEach(([key, value]) => {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 10, yPos);
      yPos += 10;
    });
    doc.save(`${section}.pdf`);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 240 : 280;

  const totalProgress = Object.values(completedForms).filter(Boolean).length;

  useEffect(() => {
    localStorage.setItem('perfectAvatarProgress', totalProgress.toString());
  }, [totalProgress]);

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
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Perfect Avatar ® ({totalProgress}/3 completed)
          </Typography>
          
          <Grid container spacing={3}>
            {/* Target Market Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Target size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      TARGET MARKET MATCHMAKER ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="PASSION"
                    multiline
                    rows={3}
                    value={formData.targetMarket.passion}
                    onChange={handleChange('targetMarket', 'passion')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="PROFIT"
                    multiline
                    rows={3}
                    value={formData.targetMarket.profit}
                    onChange={handleChange('targetMarket', 'profit')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="PROBLEMS"
                    multiline
                    rows={3}
                    value={formData.targetMarket.problems}
                    onChange={handleChange('targetMarket', 'problems')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('targetMarket')}
                    fullWidth
                    startIcon={completedForms.targetMarket ? <Download /> : null}
                  >
                    {completedForms.targetMarket ? 'Download PDF' : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Avatar Snapshot Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Camera size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      AVATAR SNAPSHOT ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="AVATAR OVERVIEW"
                    multiline
                    rows={3}
                    value={formData.avatarSnapshot.overview}
                    onChange={handleChange('avatarSnapshot', 'overview')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="WHO THEY ARE"
                    multiline
                    rows={3}
                    value={formData.avatarSnapshot.whoTheyAre}
                    onChange={handleChange('avatarSnapshot', 'whoTheyAre')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="WHAT THEY DO"
                    multiline
                    rows={3}
                    value={formData.avatarSnapshot.whatTheyDo}
                    onChange={handleChange('avatarSnapshot', 'whatTheyDo')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="WHERE THEY ARE"
                    multiline
                    rows={3}
                    value={formData.avatarSnapshot.whereTheyAre}
                    onChange={handleChange('avatarSnapshot', 'whereTheyAre')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('avatarSnapshot')}
                    fullWidth
                    startIcon={completedForms.avatarSnapshot ? <Download /> : null}
                  >
                    {completedForms.avatarSnapshot ? 'Download PDF' : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Avatar Goals Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Goal size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      AVATAR GOALS ®
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="CURRENT GOALS"
                    multiline
                    rows={3}
                    value={formData.avatarGoals.currentGoals}
                    onChange={handleChange('avatarGoals', 'currentGoals')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="LONG TERM ASPIRATIONS"
                    multiline
                    rows={3}
                    value={formData.avatarGoals.longTermAspirations}
                    onChange={handleChange('avatarGoals', 'longTermAspirations')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="CURRENT OBSTACLES"
                    multiline
                    rows={3}
                    value={formData.avatarGoals.currentObstacles}
                    onChange={handleChange('avatarGoals', 'currentObstacles')}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="LONG TERM FEARS"
                    multiline
                    rows={3}
                    value={formData.avatarGoals.longTermFears}
                    onChange={handleChange('avatarGoals', 'longTermFears')}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    onClick={() => handleSave('avatarGoals')}
                    fullWidth
                    startIcon={completedForms.avatarGoals ? <Download /> : null}
                  >
                    {completedForms.avatarGoals ? 'Download PDF' : 'Save'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PerfectAvatar;