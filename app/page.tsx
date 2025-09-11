'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Container, Typography, Button, CircularProgress } from '@mui/material'
import StudentList from './component/StudentList'

export default function Home() {
  const { data: session, status } = useSession()

  // ขณะรอข้อมูล session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }

  // ถ้าเป็น admin หรือ teacher ให้แสดงหน้า StudentList
  if (status === 'authenticated' && (session.user?.role === 'admin' || session.user?.role === 'teacher')) {
    return (
      <Container>
        <StudentList />
      </Container>
    )
  }

  // สำหรับผู้ใช้ทั่วไป (เช่น role 'student') และ guest
  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        ยินดีต้อนรับสู่ระบบจัดการนักศึกษา
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        ระบบที่ช่วยให้การจัดการข้อมูลนักศึกษาง่ายและมีประสิทธิภาพ
      </Typography>
      {status === 'authenticated' && (
        <Typography variant="h6" sx={{ mt: 4 }}>
          เข้าสู่ระบบในฐานะ {session.user?.role}.
          <br />
          <Link href="/dashboard" passHref><Button variant="contained" sx={{ mt: 2 }}>ไปยัง Dashboard ของคุณ</Button></Link>
        </Typography>
      )}
    </Container>
  )
}
