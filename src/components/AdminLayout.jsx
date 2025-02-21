import React, { useState } from 'react';
import { Box, Toolbar, useTheme, styled, alpha } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  width: '100%',
  minHeight: '100vh',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(145deg, ${alpha(theme.palette.background.default, 0.9)}, ${alpha(theme.palette.background.default, 0.7)})` 
    : `linear-gradient(145deg, ${alpha('#dfdfdf', 0.9)}, ${alpha('#ffffff', 0.7)})`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
}));

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();

  if (!user || user.role !== 'admin') {
    return <Box>شما دسترسی به این بخش را ندارید</Box>;
  }

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

export default AdminLayout;