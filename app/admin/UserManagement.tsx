'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  username: string
  role: 'admin' | 'user' | 'teacher' | 'student'
  createdAt: string
}

export default function UserManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch users')
      }
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'teacher' | 'student') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update role')
      }
      fetchUsers() // Refresh user list
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`)
      } else {
        alert('An unknown error occurred while updating role.')
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to delete user')
        }
        fetchUsers() // Refresh user list
      } catch (err) {
        if (err instanceof Error) {
          alert(`Error: ${err.message}`)
        } else {
          alert('An unknown error occurred while deleting user.')
        }
      }
    }
  }

  if (isLoading) return <div className="text-center p-4">Loading users...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-4 px-4 whitespace-nowrap">{user.username}</td>
              <td className="py-4 px-4 whitespace-nowrap"> 
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user' | 'teacher' | 'student')} disabled={user.id === session?.user?.id} className="p-1 border rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed">
                  <option value="user">User</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('th-TH')}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <button onClick={() => handleDeleteUser(user.id)} disabled={user.id === session?.user?.id} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}