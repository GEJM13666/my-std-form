'use client'

import StudentList from "./component/StudentList";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { Box, Container } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Main content */}
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* StudentList will be at the top of the container */}
        <StudentList />
      </Container>
      
      {/* Footer stays at the bottom */}
      <Footer />
    </Box>
  );
}
