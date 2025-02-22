import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Fade,
    Link,
    Button,
} from '@mui/material';
import {
    Timeline as TimelineIcon,
    Feedback as FeedbackIcon,
    Copyright as CopyrightIcon
} from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {styled} from '@mui/material/styles';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const StyledContainer = styled(Container)(({theme}) => ({
    padding: theme.spacing(4),
    maxWidth: '100%',
}));

const StyledPaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    marginBottom: theme.spacing(4)
}));

const StyledTableContainer = styled(TableContainer)(({theme}) => ({
    borderRadius: 12,
    '& .MuiTable-root': {
        borderCollapse: 'separate',
        borderSpacing: '0 8px',
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: 'none',
        padding: theme.spacing(2),
        '&:first-of-type': {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
        },
        '&:last-child': {
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
        },
    },
    '& .MuiTableBody-root .MuiTableRow-root': {
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
    },
    '& .MuiTableCell-root': {
        border: 'none',
        padding: theme.spacing(2),
    }
}));

const TitleContainer = styled(Box)(({theme}) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
}));

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
});

const StyledFooter = styled(Box)(({theme}) => ({
    marginTop: theme.spacing(6),
    padding: theme.spacing(3),
    background: 'linear-gradient(to right, #f8f9fa, #ffffff, #f8f9fa)',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
}));

const FooterContent = styled(Box)(({theme}) => ({
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

const CopyrightText = styled(Typography)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const FeedbackLink = styled(Link)(({theme}) => ({
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

const LogoutButton = styled(Button)(({theme}) => ({
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.error.light,
    },
}));

// Fallback data
const fallbackData = {
    groups: {
        group0: {color: "#F28B82"},
        group1: {color: "#FBBC05"},
        group2: {color: "#34A853"},
        group3: {color: "#4285F4"},
        group4: {color: "#A142F4"},
        group5: {color: "#F4B400"},
        group6: {color: "#FF6D01"},
        group7: {color: "#46BD77"},
        group8: {color: "#B39DDB"}
    },
    days: [
        {
            day: "۱",
            emergency: "منصوری",
            ccu: "محمدی",
            hematology: "رضایی",
            general: "عسکری پور",
            gastro: "عباسی",
            nephrology: "حسینی",
            endocrine: "علوی",
            pulmonary: "نوری"
        }
    ],
    doctors: [
        {
            name: "منصوری",
            department: "داخلی",
            emergency_count: 3,
            holiday_count: 4,
            emergency_holiday: 0,
            ccu_count: 0,
            hematology_count: 1,
            general_count: 2,
            gastro_count: 1,
            nephrology_count: 1,
            endocrine_count: 1,
            pulmonary_count: 1,
        }
    ]
};

const Dashboard = () => {
    const {user, logout} = useAuth();
    const [days, setDays] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [daysRes, doctorsRes] = await Promise.all([
                    axios.get('https://hospital.liara.run/api/days'),
                    axios.get('https://hospital.liara.run/api/doctors')
                ]);
                setDays(daysRes.data || fallbackData.days);
                setDoctors(doctorsRes.data || fallbackData.doctors);
            } catch (error) {
                console.error('Error fetching data:', error);
                setDays(fallbackData.days);
                setDoctors(fallbackData.doctors);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: 'primary.main',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
            </LoadingContainer>
        );
    }

    return (
        <StyledContainer dir="rtl">
            <Fade in={true} timeout={1000}>
                <TitleContainer>
                    <TimelineIcon sx={{fontSize: 48, color: 'primary.main', mb: 2}}/>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        برنامه کشیک بخش‌های {user?.name}
                    </Typography>
                </TitleContainer>
            </Fade>

            <StyledPaper elevation={0}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                    جدول زمان‌بندی کشیک‌ها
                </Typography>
                <StyledTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>روز</TableCell>
                                <TableCell>اورژانس</TableCell>
                                <TableCell>CCU</TableCell>
                                <TableCell>هماتولوژی</TableCell>
                                <TableCell>جنرال</TableCell>
                                <TableCell>گوارش</TableCell>
                                <TableCell>نفرولوژی</TableCell>
                                <TableCell>غدد/روماتولوژی</TableCell>
                                <TableCell>ریه</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {days.map((day, index) => (
                                <TableRow key={index}>
                                    <TableCell>{day.day}</TableCell>
                                    <TableCell>{day.emergency}</TableCell>
                                    <TableCell>{day.ccu}</TableCell>
                                    <TableCell>{day.hematology}</TableCell>
                                    <TableCell>{day.general}</TableCell>
                                    <TableCell>{day.gastro}</TableCell>
                                    <TableCell>{day.nephrology}</TableCell>
                                    <TableCell>{day.endocrine}</TableCell>
                                    <TableCell>{day.pulmonary}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </StyledPaper>

            <StyledPaper elevation={0}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                    گزارش عملکرد پزشکان
                </Typography>
                <StyledTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>نام پزشک</TableCell>
                                <TableCell>بخش</TableCell>
                                <TableCell>اورژانس</TableCell>
                                <TableCell>تعطیلات</TableCell>
                                <TableCell>اورژانس تعطیل</TableCell>
                                <TableCell>CCU</TableCell>
                                <TableCell>هماتولوژی</TableCell>
                                <TableCell>جنرال</TableCell>
                                <TableCell>گوارش</TableCell>
                                <TableCell>نفرولوژی</TableCell>
                                <TableCell>غدد/روماتولوژی</TableCell>
                                <TableCell>ریه</TableCell>
                                <TableCell>کل شیفت‌ها</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctors.map((doctor, index) => {
                                const totalShifts =
                                    doctor.emergency_count +
                                    doctor.ccu_count +
                                    doctor.hematology_count +
                                    doctor.general_count +
                                    doctor.gastro_count +
                                    doctor.nephrology_count +
                                    doctor.endocrine_count +
                                    doctor.pulmonary_count;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{doctor.name}</TableCell>
                                        <TableCell>{doctor.department}</TableCell>
                                        <TableCell>{doctor.emergency_count}</TableCell>
                                        <TableCell>{doctor.holiday_count}</TableCell>
                                        <TableCell>{doctor.emergency_holiday}</TableCell>
                                        <TableCell>{doctor.ccu_count}</TableCell>
                                        <TableCell>{doctor.hematology_count}</TableCell>
                                        <TableCell>{doctor.general_count}</TableCell>
                                        <TableCell>{doctor.gastro_count}</TableCell>
                                        <TableCell>{doctor.nephrology_count}</TableCell>
                                        <TableCell>{doctor.endocrine_count}</TableCell>
                                        <TableCell>{doctor.pulmonary_count}</TableCell>
                                        <TableCell>{totalShifts}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </StyledPaper>

            <StyledFooter>
                <FooterContent>
                    <CopyrightText variant="body2">
                        <CopyrightIcon fontSize="small"/>
                        تمامی حقوق محفوظ است {new Date().getFullYear()}
                    </CopyrightText>

                    <FeedbackLink href="/feedback">
                        <FeedbackIcon fontSize="small"/>
                        <Typography variant="body2" fontWeight="medium">
                            ارسال بازخورد
                        </Typography>
                    </FeedbackLink>

                    <LogoutButton variant="outlined" onClick={handleLogout}>
                        <ExitToAppIcon fontSize="small"/>
                        خروج
                    </LogoutButton>
                </FooterContent>
            </StyledFooter>
        </StyledContainer>
    );
};

export default Dashboard;