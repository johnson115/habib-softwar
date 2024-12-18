import React, { useState, useEffect, useCallback } from 'react';
import { FilePen, Download, Play } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  LinearProgress, 
  Typography, 
  Box, 
  Grid, 
  useTheme, 
  useMediaQuery, 
  Button,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import SideDrawer from '../components/drawer';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import axios from 'axios';

const Home = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 240 : 280;
  const [activeProject, setActiveProject] = useState(null);
  const [stepsProgress, setStepsProgress] = useState({
    perfectAvatar: 0,
    millionDollar: 0,
    perfectOffer: 0,
    ultimateLeadMagnet: 0,
    matrixRoadmap: 0,
    businessEngine: 0,
    webinarTemplate: 0,
    helperPage: 0,
    contentStrategy: 0,
    emailSequence: 0,
    trafficOnDemand: 0,
    websiteFunnels: 0
  });
  const [videoOpen, setVideoOpen] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchActiveProject = useCallback(async () => {
    if (!projectId) {
      console.log("No project ID found, redirecting to project creation");
      navigate('/create-project');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost/projectapi.php/projects/${projectId}`,
        {
          headers: { "Authorization": token },
        }
      );

      if (response.data) {
        setActiveProject(response.data);
        
        // Fetch the actual data for each step to calculate progress
        const steps = [
          { key: 'perfectAvatar', total: 6 },
          { key: 'millionDollar', total: 6 },
          { key: 'perfectOffer', total: 8 },
          { key: 'ultimateLeadMagnet', total: 9 },
          { key: 'matrixRoadmap', total: 9 },
          { key: 'businessEngine', total: 3 },
          { key: 'webinarTemplate', total: 3 },
          { key: 'helperPage', total: 1 },
          { key: 'contentStrategy', total: 1 },
          { key: 'emailSequence', total: 1 },
          { key: 'trafficOnDemand', total: 1 },
          { key: 'websiteFunnels', total: 1 }
        ];

        const progressPromises = steps.map(step => 
          axios.get(`http://localhost/projectdataapi.php`, {
            params: {
              project_id: projectId,
              step_name: step.key
            },
            headers: { "Authorization": token },
          }).catch(error => {
            console.error(`Error fetching ${step.key} data:`, error);
            return { data: { status: 'error' } };
          })
        );

        const progressResponses = await Promise.all(progressPromises);
        const newProgress = {};

        progressResponses.forEach((response, index) => {
          const step = steps[index];
          if (response.data.status === 'success') {
            // Calculate progress based on completed fields in the step data
            const stepData = response.data.data;
            let completedSections = 0;

            // Check each section of the step data
            if (step.key === 'perfectAvatar') {
              const sections = ['clientGender', 'clientAge', 'clientsCoreProblem', 'clients_ultimate_goal', 'clientsNiche', 'frustrated_questions_before_bed_time'];
              completedSections = sections.filter(section => 
                stepData[section] && Object.values(stepData[section]).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'millionDollar') {
              const sections = ['productName', 'productType', 'productValue', 'problemsSolved', 'productPrice', 'deliveryTimeline'];
              completedSections = sections.filter(section => 
                stepData[section] && Object.values(stepData[section]).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'perfectOffer') {
              const sections = ['productName', 'coreProblems', 'problemSolution', 'deliveryMethod', 'bonuses', 'urgencyType', 'pricing', 'guarantees'];
              completedSections = sections.filter(section => 
                stepData[section] && Object.values(stepData[section]).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'ultimateLeadMagnet') {
              completedSections = stepData.filter(form => 
                Object.values(form).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'matrixRoadmap') {
              completedSections = stepData.filter(form => 
                Object.values(form).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'businessEngine') {
              const sections = ['lowTicket', 'midTicket', 'highTicket'];
              completedSections = sections.filter(section => 
                stepData[section] && Object.values(stepData[section]).every(value => value && value.trim() !== '')
              ).length;
            } else if (step.key === 'webinarTemplate') {
              const sections = ['webinarBigPicture', 'ultimateFramework', 'pitch'];
              completedSections = sections.filter(section => 
                stepData[section] && Object.values(stepData[section]).every(value => value && value.trim() !== '')
              ).length;
            } else {
              completedSections = stepData ? Object.keys(stepData).length : 0;
            }

            newProgress[step.key] = completedSections;
          } else {
            newProgress[step.key] = 0;
          }
        });

        setStepsProgress(newProgress);
      }
    } catch (error) {
      console.error("Error fetching active project:", error);
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Project not found, redirecting to project creation");
          navigate("/create-project");
        } else if (error.response.status === 401) {
          console.log("Unauthorized, redirecting to login");
          navigate("/login");
        }
      }
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchActiveProject();
  }, [fetchActiveProject]);

  const isAllComplete = () => {
    const steps = [
      { key: 'perfectAvatar', total: 6 },
      { key: 'millionDollar', total: 6 },
      { key: 'perfectOffer', total: 8 },
      { key: 'ultimateLeadMagnet', total: 9 },
      { key: 'matrixRoadmap', total: 9 },
      { key: 'businessEngine', total: 3 },
      { key: 'webinarTemplate', total: 3 },
      { key: 'helperPage', total: 1 },
      { key: 'contentStrategy', total: 1 },
      { key: 'emailSequence', total: 1 },
      { key: 'trafficOnDemand', total: 1 },
      { key: 'websiteFunnels', total: 1 }
    ];

    return steps.every(step => stepsProgress[step.key] >= step.total);
  };

  const generateFullPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const steps = Object.keys(stepsProgress);

      const dataPromises = steps.map(step => 
        axios.get(`http://localhost/projectdataapi.php`, {
          params: {
            project_id: projectId,
            step_name: step
          },
          headers: { 'Authorization': token }
        })
      );

      const responses = await Promise.all(dataPromises);
      const projectData = {};
      responses.forEach((response, index) => {
        if (response.data.status === 'success') {
          projectData[steps[index]] = response.data.data;
        }
      });

      const doc = new jsPDF();
      let yPos = 10;
      const lineHeight = 10;
      const margin = 10;
      const pageHeight = doc.internal.pageSize.height;

      const addText = (text, indent = 0) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(text, margin + indent, yPos);
        yPos += lineHeight;
      };

      const addSection = (title, data) => {
        addText(title, 0);
        Object.entries(data).forEach(([key, value]) => {
          addText(`${key}: ${value}`, 5);
        });
        yPos += lineHeight;
      };

      doc.setFontSize(20);
      addText('Complete Business Strategy');
      yPos += lineHeight;
      doc.setFontSize(12);

      steps.forEach((step, index) => {
        addSection(`${index + 1}. ${step.charAt(0).toUpperCase() + step.slice(1)}`, projectData[step]);
      });

      doc.save('complete_business_strategy.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const steps = [
    {
      title: "Perfect Client avatar",
      icon: "👤",
      step: 1,
      progress: stepsProgress.perfectAvatar,
      total: 6,
      dir: `/perfect-avatar/${projectId}`,
      key: "perfectAvatar"
    },
    {
      title: "your perfect offer checklist",
      icon: "💎",
      step: 2,
      progress: stepsProgress.perfectOffer,
      total: 8,
      dir: `/perfect-offer/${projectId}`,
      key: "perfectOffer"
    },
    {
      title: "Your Ultimate Message",
      icon: "💰",
      step: 3,
      progress: stepsProgress.millionDollar,
      total: 6,
      dir: `/million-dollar-message/${projectId}`,
      key: "millionDollar"
    },
    {
      title: "Your 3:6:9 Matrix Roadmap",
      icon: "📊",
      step: 4,
      progress: stepsProgress.matrixRoadmap,
      total: 9,
      dir: `/Matrix-Roadmap/${projectId}`,
      key: "matrixRoadmap"
    },
    {
      title: "Ultimate Lead Magnet",
      icon: "🧲",
      step: 5,
      progress: stepsProgress.ultimateLeadMagnet,
      total: 9,
      dir: `/ultimate-lead-magnet/${projectId}`,
      key: "ultimateLeadMagnet"
    },
    {
      title: "your business engine mechanism",
      icon: "⚙️",
      step: 6,
      progress: stepsProgress.businessEngine,
      total: 3,
      dir: `/Business-Engine/${projectId}`,
      key: "businessEngine"
    },
    {
      title: "Your Webinar Template ",
      icon: "🎥",
      step: 7,
      progress: stepsProgress.webinarTemplate,
      total: 3,
      dir: `/Webinar-Template/${projectId}`,
      key: "webinarTemplate"
    },
    {
      title: "Your helper page structure",
      icon: "📋",
      step: 8,
      progress: stepsProgress.helperPage,
      total: 1,
      dir: "#",
      key: "helperPage",
      comingSoon: true
    },
    {
      title: "Your Content Strategy",
      icon: "📝",
      step: 9,
      progress: stepsProgress.contentStrategy,
      total: 1,
      dir: "#",
      key: "contentStrategy",
      comingSoon: true
    },
    {
      title: "your email follow-up sequence",
      icon: "✉️",
      step: 10,
      progress: stepsProgress.emailSequence,
      total: 1,
      dir: "#",
      key: "emailSequence",
      comingSoon: true
    },
    {
      title: "Traffic on demand",
      icon: "🚦",
      step: 11,
      progress: stepsProgress.trafficOnDemand,
      total: 1,
      dir: "#",
      key: "trafficOnDemand",
      comingSoon: true
    },
    {
      title: "Your website, funnels and Ads template",
      icon: "🌐",
      step: 12,
      progress: stepsProgress.websiteFunnels,
      total: 1,
      dir: "#",
      key: "websiteFunnels",
      comingSoon: true
    }
  ];

  return (
    <>
      <SideDrawer 
        open={open} 
        setOpen={setOpen} 
        activeProject={activeProject} 
        setActiveProject={setActiveProject}
        onProjectChange={fetchActiveProject}
      />
      {activeProject ? (
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: open ? `${drawerWidth}px` : 0 },
            bgcolor: '#F3F3E0',
            minHeight: '100vh',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Play size={16} />}
            onClick={() => setVideoOpen(true)}
            sx={{
              bgcolor: '#240750',
              color: 'white',
              '&:hover': {
                bgcolor: '#240770',
              }
            }}
          >
            Watch Intro Video
          </Button>
        </Box>
          <Box sx={{ 
            mb: 4, 
            mt: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{color:"#240750", textAlign:"center"}} component="h1">
                Campaign Dashboard
              </Typography>
              
            </Box>
            {isAllComplete() && (
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={generateFullPDF}
              >
                Download Full Strategy
              </Button>
            )}
          </Box>
          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid item xs={12} sm={6} md={4} key={step.step}>
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
                    <FilePen size={20} color={theme.palette.text.secondary} style={{
                      cursor: step.comingSoon ? "not-allowed" : "pointer",
                      borderRadius:"50%",
                      transition:"all 0.7s",
                      '&:hover': {
                        boxShadow: 6,
                        backgroundColor:'#999999'
                      }
                    }} onClick={() => {
                      if (!step.comingSoon) {
                        navigate(step.dir)
                      }
                    }} />
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
                    {step.comingSoon ? (
                      <Button
                        variant="contained"
                        disabled
                        fullWidth
                        sx={{ mt: 2, bgcolor: 'grey.300' }}
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      step.progress === step.total ? (
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const response = await axios.get(`http://localhost/projectdataapi.php`, {
                                params: {
                                  project_id: projectId,
                                  step_name: step.key
                                },
                                headers: { 'Authorization': token }
                              });
                              const stepData = response.data.data;

                              const doc = new jsPDF();
                              doc.setFontSize(16);
                              doc.text(step.title, 10, 10);
                              doc.setFontSize(12);
                              let yPos = 30;
                              Object.entries(stepData).forEach(([key, value]) => {
                                doc.text(`${key}: ${value}`, 10, yPos);
                                yPos += 10;
                              });
                              doc.save(`${step.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
                            } catch (error) {
                              console.error('Error generating PDF:', error);
                            }
                          }}
                          fullWidth
                          sx={{ mt: 2 ,backgroundColor:"#000080" }}
                        >
                          Download PDF
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          component={Link}
                          to={step.dir}
                          fullWidth
                          sx={{ mt: 2 , backgroundColor:"#000080" }}
                        >
                          Continue
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="h2" color="white" >Loading project...</Typography>
        </Box>
      )}

      {/* Video Dialog */}
       <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ bgcolor: 'rgba(0,0,0,0.7)',}}
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
            ✕
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

export default Home;

