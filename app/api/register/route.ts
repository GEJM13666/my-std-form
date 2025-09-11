import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json()

    // 1. ตรวจสอบข้อมูล
    if (!username || !password || !role) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 })
    }

    // 2. ตรวจสอบ Role ที่อนุญาต
    if (!['teacher', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Role ไม่ถูกต้อง' }, { status: 400 })
    }

    // 3. ตรวจสอบว่ามี username นี้ในระบบแล้วหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' }, { status: 409 })
    }

    // 4. Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. สร้างผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    })

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ', userId: user.id })
  } catch (error) {
    console.error('Registration failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}