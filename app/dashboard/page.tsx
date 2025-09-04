import { getServerSession } from 'next-auth' 
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
 
export default async function DashboardPage() { 
  const session = await getServerSession(authOptions) 
  return ( 
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1> 
        <p className="mt-2">ยินดีต้อนรับ, {session?.user?.username}</p> 
        <p>บทบาท: {session?.user?.role}</p>
        <div className="mt-6 space-y-4">
          <Link href="/profile" className="font-medium text-indigo-600 hover:text-indigo-500">ไปที่หน้าโปรไฟล์เพื่อเปลี่ยนรหัสผ่าน</Link>
          {session?.user?.role === 'admin' && (
            <div>
              <Link href="/admin" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                ไปที่หน้าจัดการผู้ใช้ (Admin)
              </Link>
            </div>
          )}
        </div>
      </div>
    </div> 
  ) 
}
