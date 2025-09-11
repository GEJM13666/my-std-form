'use client'

import { useState, FormEvent } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image' // Use Next.js Image for optimization

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession() // Get update function
  const router = useRouter()

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  // State for profile image upload
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleImageUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) {
      setImageError('กรุณาเลือกรูปภาพ')
      return
    }

    setIsImageLoading(true)
    setImageError(null)

    try {
      // Step 1: Upload the file to get a URL
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')

      const imageUrl = uploadData.url

      // Step 2: Update the user's profile with the new image URL
      const updateRes = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
      })
      const updateData = await updateRes.json()
      if (!updateRes.ok) throw new Error(updateData.error || 'Failed to update profile')

      // Step 3: Trigger a session update to reflect the new image in the UI
      await updateSession({ image: imageUrl })

      setFile(null)
      setImagePreview(null)
      alert('อัปเดตรูปโปรไฟล์สำเร็จ!')
    } catch (err) {
      if (err instanceof Error) {
        setImageError(err.message)
      } else {
        setImageError('An unknown error occurred.')
      }
    } finally {
      setIsImageLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน')
      setIsPasswordLoading(false)
      return
    }

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้')
      }

      setPasswordSuccess('เปลี่ยนรหัสผ่านสำเร็จ!')
      // ล้างค่าในฟอร์ม
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err instanceof Error) {
        setPasswordError(err.message)
      } else {
        setPasswordError('An unknown error occurred.')
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  // ขณะรอข้อมูล session
  if (status === 'loading') {
    return <div className="p-6 text-center">Loading...</div>
  }

  // ถ้ายังไม่ล็อกอิน ให้ redirect ไปหน้า login
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile Picture</h1>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={imagePreview || session?.user?.image || '/default-avatar.png'} // Fallback to a default avatar
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full object-cover"
            priority
          />
          <form onSubmit={handleImageUpload} className="w-full space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
            <button
              type="submit"
              disabled={isImageLoading || !file}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isImageLoading ? 'กำลังอัปโหลด...' : 'อัปเดตรูปภาพ'}
            </button>
          </form>
        </div>
      </div>

      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Change Password</h1>
        <p className="text-center text-gray-600 mb-6">
          สำหรับ <strong>{session?.user?.username}</strong>
        </p>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่านปัจจุบัน
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่านใหม่
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 text-sm mb-4">{passwordSuccess}</p>}

          <div>
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isPasswordLoading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
