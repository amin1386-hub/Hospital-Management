import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Fade,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Send as SendIcon,
  Feedback as FeedbackIcon,
  Dashboard as DashboardIcon,
  Copyright as CopyrightIcon
} from '@mui/icons-material';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '1.1rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(3),
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(3),
  background: 'linear-gradient(to right, #f8f9fa, #ffffff, #f8f9fa)',
  borderRadius: '16px 16px 0 0',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    textAlign: 'center',
  }
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const DashboardLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}15`,
    transform: 'translateY(-2px)',
  }
}));

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    kind_of_feedback: '',
    subject: '',
    message: '',
    rating: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      kind_of_feedback: feedback.kind_of_feedback,
      subject: feedback.subject,
      message: feedback.message,
      rating: feedback.rating
    };

    try {
      const response = await axios.post('https://hospital.liara.run/api/feedbacks/', feedbackData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: 'بازخورد شما با موفقیت ثبت شد',
          severity: 'success'
        });

        setFeedback({
          kind_of_feedback: '',
          subject: '',
          message: '',
          rating: null
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'خطا در ثبت بازخورد',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    });
  };

  return (
      <Container maxWidth="md">
        <Box p={4} dir="rtl">
          <Fade in={true} timeout={1000}>
            <Box textAlign="center" mb={4}>
              <FeedbackIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                ارسال بازخورد
              </Typography>
              <Typography color="text.secondary" mb={4}>
                نظرات و پیشنهادات شما به ما کمک می‌کند تا خدمات بهتری ارائه دهیم
              </Typography>
            </Box>
          </Fade>

          <StyledPaper elevation={0}>
            <form onSubmit={handleSubmit}>
              <StyledFormControl fullWidth margin="normal">
                <InputLabel>نوع بازخورد</InputLabel>
                <Select
                    name="kind_of_feedback"
                    value={feedback.kind_of_feedback}
                    onChange={handleChange}
                    required
                >
                  <MenuItem value="SUGGESTION">پیشنهاد</MenuItem>
                  <MenuItem value="COMPLAINT">شکایت</MenuItem>
                  <MenuItem value="BUG">گزارش مشکل</MenuItem>
                  <MenuItem value="OTHER">سایر</MenuItem>
                </Select>
              </StyledFormControl>

              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="موضوع"
                  name="subject"
                  value={feedback.subject}
                  onChange={handleChange}
                  required
              />

              <StyledTextField
                  fullWidth
                  margin="normal"
                  label="پیام"
                  name="message"
                  value={feedback.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
              />

              <RatingContainer>
                <Typography component="legend" fontWeight="medium" mb={1}>
                  امتیاز شما به سیستم
                </Typography>
                <Rating
                    name="rating"
                    value={feedback.rating}
                    onChange={(event, newValue) => {
                      setFeedback({ ...feedback, rating: newValue });
                    }}
                    size="large"
                />
              </RatingContainer>

              <StyledButton
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  fullWidth
              >
                ارسال بازخورد
              </StyledButton>
            </form>
          </StyledPaper>

          <StyledFooter>
            <FooterContent>
              <CopyrightText variant="body2">
                <CopyrightIcon fontSize="small" />
                تمامی حقوق محفوظ است
                {' '}
                {new Date().getFullYear()}
              </CopyrightText>

              <DashboardLink href="/dashboard">
                <DashboardIcon fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  بازگشت به داشبورد
                </Typography>
              </DashboardLink>
            </FooterContent>
          </StyledFooter>

          <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                variant="filled"
                sx={{ borderRadius: 3 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
  );
};

export default Feedback;