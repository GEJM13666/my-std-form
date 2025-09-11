'use client'

import { useState, FormEvent } from 'react'
import { useSession } from 'next-auth/react'

export default function UploadTestPage() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setIsUploading(true)
    setMessage('')
    setError('')
    setUploadedImageUrl(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setMessage(data.message)
      setUploadedImageUrl(data.url)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (status === 'loading') return <p>Loading session...</p>
  if (status === 'unauthenticated') return <p>Please log in to upload files.</p>

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Secure File Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="file-input file-input-bordered w-full" />
        <button type="submit" disabled={isUploading} className="btn btn-primary w-full">{isUploading ? 'Uploading...' : 'Upload'}</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {uploadedImageUrl && <div className="mt-4"><p>Uploaded Image:</p><img src={uploadedImageUrl} alt="Uploaded content" className="mt-2 border rounded-md max-w-full" /></div>}
    </div>
  )
}
