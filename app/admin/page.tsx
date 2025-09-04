import UserManagement from './UserManagement'
 
export default function AdminPage() {
  return ( 
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-8">
        จัดการผู้ใช้ทั้งหมดในระบบ เปลี่ยนบทบาท หรือลบผู้ใช้ออกจากระบบ
      </p>
      <UserManagement />
    </div> 
  ) 
}

