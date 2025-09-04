import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  // 1. ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await req.json()

    // 2. ตรวจสอบข้อมูลที่ส่งมา
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่' },
        { status: 400 }
      )
    }

    // 3. ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้งาน' }, { status: 404 })
    }

    // 4. ตรวจสอบรหัสผ่านปัจจุบัน
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }, { status: 403 })
    }

    // 5. เข้ารหัสรหัสผ่านใหม่
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // 6. อัปเดตรหัสผ่านในฐานข้อมูล
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    })

    return NextResponse.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' }, { status: 200 })
  } catch (err) {
    console.error('Password change error:', err)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    )
  }
}

