import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// Update user role (Admin only)
export const PUT = (async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions)
  const { id } = params // ตอนนี้ id ดึงมาจาก params ที่ destructure มาแล้ว

  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { role } = await req.json()
    if (!['admin', 'user', 'teacher', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // ป้องกันไม่ให้ admin ลดระดับสิทธิ์ของตัวเอง
    if (session.user.id === id && role !== 'admin') {
      return NextResponse.json(
        { error: 'ไม่สามารถลดระดับสิทธิ์ของตนเองได้' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { role: role },
      select: { id: true, username: true, role: true },
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Failed to update user role:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}) as any

// Delete a user (Admin only)
export const DELETE = (async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions)
  const { id } = params // ตอนนี้ id ดึงมาจาก params ที่ destructure มาแล้ว

  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Prevent admin from deleting themselves
  if (session.user.id === id) {
    return NextResponse.json(
      { error: 'ไม่สามารถลบบัญชีของตนเองได้' },
      { status: 400 }
    )
  }

  try {
    await prisma.user.delete({ where: { id: id } })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}) as any
