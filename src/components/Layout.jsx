import React, { useState } from 'react';
import { Box, Toolbar, useTheme, styled, alpha } from '@mui/material';

const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    minHeight: '100vh',
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(145deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.background.default, 0.7)})`
        : `linear-gradient(145deg, ${alpha('#dfdfdf', 0.9)}, ${alpha('#ffffff', 0.7)})`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
}));

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                backgroundColor: theme.palette.mode === 'dark'
                    ? theme.palette.background.default
                    : '#f5f5f5'
            }}
        >
            <MainContent>
                <Toolbar />
                {children}
            </MainContent>
        </Box>
    );
};

export default Layout;