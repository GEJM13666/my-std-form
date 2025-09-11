import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { image } = await req.json()

    if (typeof image !== 'string') {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: image },
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}