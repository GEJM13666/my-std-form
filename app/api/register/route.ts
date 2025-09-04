import { NextResponse } from 'next/server' 
import { prisma } from '@/lib/prisma' 
import bcrypt from 'bcryptjs' 
 
export async function POST(req: Request) { 
  try { 
    const { username, password, role } = await req.json() 
 
    // 1) ตรวจข้อมูลเบื้องต้น 
    if (!username || !password) { 
      return NextResponse.json({ error: 'username/password ห้ามว่าง' }, { status: 400 }) 
    } 
 
    // 2) ป้องกันชื่อซํ้า 
    const exists = await prisma.user.findUnique({ where: { username } }) 
    if (exists) { 
      return NextResponse.json({ error: 'username นี้ถูกใช้แล้ว' }, { status: 409 }) 
    } 
 
    // 3) เข้ารหัสรหัสผ่าน 
    const hashed = await bcrypt.hash(password, 10) 
 
    // 4) บันทึกผู้ใช้ 
    const user = await prisma.user.create({ 
      data: { 
        username, 
        password: hashed, 
        role: role === 'admin' ? 'admin' : 'user', // กันคนสมัครเป็น admin มั่วๆ 
      }, 
      select: { id: true, username: true, role: true, createdAt: true }, 
    }) 
 
    return NextResponse.json({ user }, { status: 201 }) 
  } catch (err) { 
    console.error(err) 
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 }) 
  } 
} 
