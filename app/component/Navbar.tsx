'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AdmissionForm } from './AdmissionForm'; // Import the AdmissionForm modal

export default function Navbar() {
  const { data: session, status } = useSession();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Open and close modal for adding new student
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  // Callback to refresh the page after a successful submission,
  // which will cause StudentList to refetch its data.
  const handleSuccess = () => {
    handleCloseModal();
    window.location.reload();
  };

  const isAdminOrTeacher = session?.user?.role === 'admin' || session?.user?.role === 'teacher';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            component={Link}
            href="/"
          >
            <SchoolIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Management
          </Typography>

          {status === 'authenticated' && isAdminOrTeacher && (
            <Button color="inherit" onClick={handleOpenModal}>
              Add Student
            </Button>
          )}

          {status === 'authenticated' ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar src={session.user?.image || undefined} alt={session.user?.username || ''} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleCloseMenu}
              >
                <MenuItem component={Link} href="/profile" onClick={handleCloseMenu}>Profile</MenuItem>
                {session.user?.role === 'admin' && (
                  <MenuItem component={Link} href="/admin" onClick={handleCloseMenu}>Admin Panel</MenuItem>
                )}
                <MenuItem onClick={() => {
                  handleCloseMenu();
                  signOut();
                }}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            status === 'unauthenticated' && (
              <>
                <Button color="inherit" component={Link} href="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} href="/register">
                  Register
                </Button>
              </>
            )
          )}
        </Toolbar>
      </AppBar>

      {/* Admission Form Modal */}
      <AdmissionForm
        open={openModal}
        onClose={handleCloseModal}  // Close the modal when canceled
        onSuccess={handleSuccess}  // Trigger action on success
      />
    </Box>
  );
}
