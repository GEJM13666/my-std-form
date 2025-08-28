'use client'

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 1. Import Server Action ของคุณ
import { getAllStudents, deleteStudent } from '@/app/actions/studentActions';
import { AdmissionForm } from './AdmissionForm';

// 2. กำหนด Type ให้ตรงกับ Prisma Model
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  major: string;
  faculty: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  // Fetch students from server
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data as unknown as Student[]);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถโหลดข้อมูลนักศึกษาได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Initial fetch when component mounts
  }, []);

  // Handle open/close for modals
  const handleOpenEditModal = (student: Student) => {
    setSelectedStudent(student);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedStudent(null);
  };

  const handleOpenDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = async () => {
    if (selectedStudent) {
      const formData = new FormData();
      formData.append('id', selectedStudent.id.toString());
      await deleteStudent(formData);
      handleCloseDeleteModal();
      fetchStudents(); // Refetch after delete
    }
  };

  // Handle edit and create by passing refetch function
  const handleEditStudent = () => {
    fetchStudents(); // Refetch after edit
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>กำลังโหลดข้อมูล...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: '16px' }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          รายชื่อนักศึกษา 🎓
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="student table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>ชื่อ</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>นามสกุล</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>สาขาวิชา</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>คณะ</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>วันที่สร้าง</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography sx={{ p: 3 }}>ไม่พบข้อมูลนักศึกษา</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{student.id}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.major}</TableCell>
                    <TableCell>{student.faculty}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{new Date(student.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenEditModal(student)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleOpenDeleteModal(student)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Modal */}
      {selectedStudent && (
        <AdmissionForm
          open={openEditModal}
          onClose={handleCloseEditModal}
          studentData={selectedStudent}
          onSuccess={handleEditStudent} // Pass refetch function as onSuccess
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>คุณแน่ใจไหมที่จะลบนักศึกษาคนนี้?</DialogTitle>
        <DialogContent>
          <Typography>{selectedStudent?.firstName} {selectedStudent?.lastName}</Typography>
          <Typography>เมื่อทำการลบแล้ว ข้อมูลจะไม่สามารถกู้คืนได้</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleDeleteStudent} color="secondary">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
