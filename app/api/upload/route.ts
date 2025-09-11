import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import path from 'path'
import { writeFile, mkdir, copyFile } from 'fs/promises'
import { randomUUID } from 'crypto'

// กำหนดค่าความปลอดภัย
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_MB = 5 // 5 MB

export async function POST(req: NextRequest) {
  // 1. ตรวจสอบสิทธิ์ผู้ใช้
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    // 2. ตรวจสอบความถูกต้องของไฟล์
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 })
    }

    // 3. ประมวลผลและบันทึกไฟล์อย่างปลอดภัย
    const fileExtension = path.extname(file.name)
    const uniqueFilename = `${randomUUID()}${fileExtension}`

    // กำหนด Path
    // ที่เก็บไฟล์จริง (นอก public folder)
    const privateStoragePath = path.join(process.cwd(), 'storage', 'uploads')
    // ที่เก็บ symlink (ใน public folder)
    const publicSymlinkPath = path.join(process.cwd(), 'public', 'uploads')
    
    const targetFilePath = path.join(privateStoragePath, uniqueFilename)
    const symlinkFilePath = path.join(publicSymlinkPath, uniqueFilename)

    // สร้างไดเรกทอรีถ้ายังไม่มี
    await mkdir(privateStoragePath, { recursive: true })
    await mkdir(publicSymlinkPath, { recursive: true })

    // แปลงไฟล์เป็น Buffer และเขียนลงใน private storage
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(targetFilePath, buffer)

    // 4. คัดลอกไฟล์ไปยัง public folder
    // การใช้ symlink() อาจทำให้เกิด Error 'EPERM' บน Windows หากไม่ได้รันด้วยสิทธิ์ Admin
    // หรือไม่ได้เปิด Developer Mode
    // การใช้ copyFile() เป็นทางเลือกที่ปลอดภัยและทำงานได้ในทุกสภาพแวดล้อม
    // แต่จะใช้พื้นที่จัดเก็บข้อมูลเพิ่มขึ้น
    await copyFile(targetFilePath, symlinkFilePath)

    // 5. ส่ง URL ของ Symlink กลับไปให้ Client
    const publicUrl = `/uploads/${uniqueFilename}`
    return NextResponse.json({ message: 'File uploaded successfully!', url: publicUrl })

  } catch (error) {
    console.error('File upload failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * หมายเหตุสำคัญ: การสร้าง Symlink ขณะ Runtime ไม่สามารถทำงานบนแพลตฟอร์ม Serverless ส่วนใหญ่ (เช่น Vercel) ได้
 * วิธีนี้เหมาะสำหรับ Node.js server environment แบบดั้งเดิม (เช่น VPS, Docker)
 */
