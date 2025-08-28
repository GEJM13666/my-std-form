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
import { getAllStudents } from '@/app/actions/studentActions'; // Import getAllStudents function

export default function Navbar() {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = React.useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = React.useState<any | null>(null);
  const [students, setStudents] = React.useState<any[]>([]);  // To hold students data

  // Open and close modal for adding new student
  const handleOpenModal = () => {
    setSelectedStudent(null);  // Clear selected student when adding a new one
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Open and close modal for editing a student
  const handleOpenEditModal = (student: any) => {
    setSelectedStudent(student);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedStudent(null);
  };

  // Fetch the students after a successful create or update
  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Callback passed to AdmissionForm to refresh the student list after success
  const handleSuccess = () => {
    fetchStudents();  // Refresh the student list
    handleCloseModal();  // Close the modal
    handleCloseEditModal();  // Close the edit modal
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
        open={openModal || openEditModal}  // Modal is open if either Add or Edit modal is triggered
        onClose={handleCloseModal}  // Close the modal when canceled
        studentData={selectedStudent}  // Pass selected student data for editing
        onSuccess={handleSuccess}  // Trigger data refresh on success
      />
    </Box>
  );
}
