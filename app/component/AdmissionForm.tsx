// app/components/AdmissionForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createStudent, updateStudent } from "@/app/actions/studentActions";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

// กำหนด Type สำหรับข้อมูลนักศึกษาที่ใช้ในฟอร์ม
interface StudentData {
  id: number;
  firstName: string;
  lastName: string;
  major: string;
  faculty: string;
  email: string;
  phone: string;
}
// Add the onSuccess prop
interface AdmissionFormProps {
  open: boolean;
  onClose: () => void;
  studentData?: StudentData | null; // Optional prop for editing
  onSuccess: () => void; // Function to be called after a successful submit
}

export function AdmissionForm({ open, onClose, studentData, onSuccess }: AdmissionFormProps) {
  const [formValues, setFormValues] = useState({
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    major: studentData?.major || '',
    faculty: studentData?.faculty || '',
    email: studentData?.email || '',
    phone: studentData?.phone || '',
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (studentData) {
      setFormValues({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        major: studentData.major,
        faculty: studentData.faculty,
        email: studentData.email,
        phone: studentData.phone,
      });
    }
  }, [studentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);

    let result;

    if (studentData) {
      // Update existing student
      result = await updateStudent(studentData.id, formData);
    } else {
      // Add new student
      result = await createStudent({ success: null, error: null }, formData);
    }

    // After successful creation or update, trigger the onSuccess callback
    if (result.success) {
      onSuccess();  // Notify parent that the action was successful
      onClose();    // Close the modal
    } else {
      // Handle errors (you could add more error handling logic here)
      console.error("Failed to submit", result.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{studentData ? "Edit Student" : "Add Student"}</DialogTitle>
      <form ref={formRef} onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Major"
            name="major"
            value={formValues.major}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Faculty"
            name="faculty"
            value={formValues.faculty}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" color="primary" disabled={pending}>
            {pending ? "Saving..." : studentData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
