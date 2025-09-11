'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';
import { AdmissionForm } from './AdmissionForm'; // Import the AdmissionForm modal

export default function Navbar() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <SchoolIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Management
          </Typography>

          {/* Button to open the Admission Form Modal */}
          <Button color="inherit" onClick={handleOpenModal}>
            Add Student
          </Button>
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
