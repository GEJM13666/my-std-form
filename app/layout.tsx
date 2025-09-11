import './globals.css' // สมมติว่ามีไฟล์ CSS พื้นฐาน
import AuthProvider from './context/AuthProvider'
import ThemeRegistry from './theme/ThemeRegistry'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import { Box, Container } from '@mui/material'

export const metadata = {
  title: 'Student Management System',
  description: 'A system to manage student information.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>{children}</Container>
              <Footer />
            </Box>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}