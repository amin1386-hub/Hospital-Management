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
import api from '../services/api';
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

const Dashboard = () => {
    const {user, logout} = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [report, setReport] = useState([]);
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
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [scheduleResponse, reportResponse] = await Promise.all([
                api.get('/api/schedule'),
                api.get('/api/report')
            ]);
            setSchedule(scheduleResponse.data.schedule.days);
            setReport(reportResponse.data.report.doctors);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schedule.map((day, index) => (
                                <TableRow key={index}>
                                    <TableCell>{day.date}</TableCell>
                                    {day.shifts.map((shift, idx) => (
                                        <TableCell
                                            key={idx}
                                            sx={{
                                                backgroundColor: `${shift.group.color}15`,
                                                color: shift.group.color,
                                                fontWeight: 500,
                                                borderRadius: '8px'
                                            }}
                                        >
                                            {shift.name}
                                        </TableCell>
                                    ))}
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
                                <TableCell>گروه</TableCell>
                                <TableCell>تعداد اورژانس</TableCell>
                                <TableCell>تعداد تعطیلات</TableCell>
                                <TableCell>تعداد شیفت کل</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.map((doctor, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doctor.name}</TableCell>
                                    <TableCell>{doctor.group}</TableCell>
                                    <TableCell>{doctor.stats.emergency.value}</TableCell>
                                    <TableCell>{doctor.stats.holiday.value}</TableCell>
                                    <TableCell>{doctor.stats.total.value}</TableCell>
                                </TableRow>
                            ))}
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