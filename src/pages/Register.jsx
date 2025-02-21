import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    CircularProgress,
    Alert,
    Container,
    Divider,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAddAlt as RegisterIcon,
    VpnKey as VpnKeyIcon,
    Phone as PhoneIcon,
    ArrowBack as ArrowBackIcon,
    Badge as BadgeIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GlassPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 450,
    margin: 'auto',
    marginTop: theme.spacing(8),
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: 24,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 60,
        height: 4,
        background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
        borderRadius: 2,
    }
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        '&.Mui-focused': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: '12px 24px',
    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
    transition: 'all 0.3s ease',
    '& .MuiButton-startIcon': {
        marginLeft: theme.spacing(2),
    },
    '& .MuiButton-endIcon': {
        marginRight: theme.spacing(2),
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(33,150,243,0.3)',
        background: 'linear-gradient(45deg, #1976D2, #1999D2)',
    },
}));

const BackButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(33,150,243,0.3)',
    '& .MuiButton-startIcon': {
        marginLeft: theme.spacing(2),
    },
    '&:hover': {
        background: 'rgba(33,150,243,0.1)',
    },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(3, 0),
    '&::before, &::after': {
        borderColor: 'rgba(0,0,0,0.1)',
    },
}));

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationStep, setVerificationStep] = useState('register');
    const { register, verifyCode } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (verificationStep === 'register') {
            const phoneRegex = /^09[0-9]{9}$/;
            if (!phoneRegex.test(formData.phoneNumber)) {
                setError('لطفاً یک شماره تلفن معتبر وارد کنید');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('رمز عبور و تکرار آن مطابقت ندارند');
                return;
            }

            setLoading(true);
            try {
                await register(formData);
                setVerificationStep('verify');
            } catch (err) {
                setError(err.message || 'خطا در ثبت‌نام');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                await verifyCode(formData.verificationCode);
                navigate('/dashboard');
            } catch (err) {
                setError('کد وارد شده صحیح نمی‌باشد');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }}
            >
                <GlassPaper elevation={0}>
                    <LogoContainer>
                        <Typography
                            component="h1"
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            {verificationStep === 'register' ? 'ثبت‌نام در سیستم' : 'تایید شماره تلفن'}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            sx={{ opacity: 0.8 }}
                        >
                            {verificationStep === 'register'
                                ? 'لطفاً اطلاعات خود را برای ثبت‌نام وارد کنید'
                                : 'کد تایید ارسال شده به تلفن همراه خود را وارد کنید'
                            }
                        </Typography>
                    </LogoContainer>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Alert
                                    severity="error"
                                    sx={{
                                        width: '100%',
                                        mb: 2,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(253,237,237,0.8)'
                                    }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {verificationStep === 'register' ? (
                        <StyledForm onSubmit={handleSubmit}>
                            <StyledTextField
                                fullWidth
                                margin="normal"
                                label="نام و نام خانوادگی"
                                name="fullName"
                                autoComplete="name"
                                autoFocus
                                value={formData.fullName}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <StyledTextField
                                fullWidth
                                margin="normal"
                                label="شماره تلفن همراه"
                                name="phoneNumber"
                                type="tel"
                                inputMode="numeric"
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || /^[0-9]+$/.test(value)) {
                                        handleChange({
                                            target: {
                                                name: 'phoneNumber',
                                                value: value.slice(0, 11)
                                            }
                                        });
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    maxLength: 11,
                                    pattern: "[0-9]*"
                                }}
                            />

                            <StyledTextField
                                fullWidth
                                margin="normal"
                                label="رمز عبور"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <StyledTextField
                                fullWidth
                                margin="normal"
                                label="تکرار رمز عبور"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ mt: 4 }}>
                                <GradientButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <RegisterIcon />}
                                >
                                    {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                                </GradientButton>
                            </Box>

                            <StyledDivider>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        px: 2,
                                        backgroundColor: 'rgba(255,255,255,0.8)'
                                    }}
                                >
                                    یا
                                </Typography>
                            </StyledDivider>

                            <BackButton
                                fullWidth
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/')}
                            >
                                بازگشت به صفحه ورود
                            </BackButton>
                        </StyledForm>
                    ) : (
                        <StyledForm onSubmit={handleSubmit}>
                            <Typography variant="body1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                                کد تایید به شماره {formData.phoneNumber} ارسال شد
                            </Typography>

                            <StyledTextField
                                fullWidth
                                margin="normal"
                                label="کد تایید"
                                name="verificationCode"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={formData.verificationCode}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    maxLength: 6
                                }}
                            />

                            <Box sx={{ mt: 4 }}>
                                <GradientButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                                >
                                    {loading ? 'در حال بررسی...' : 'تایید کد'}
                                </GradientButton>
                            </Box>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button
                                    color="primary"
                                    onClick={() => setVerificationStep('register')}
                                >
                                    تغییر شماره تلفن
                                </Button>
                            </Box>
                        </StyledForm>
                    )}
                </GlassPaper>
            </motion.div>
        </Container>
    );
};

export default Register;

const globalStyles = `
  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);