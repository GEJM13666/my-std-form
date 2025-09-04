import NextAuth from 'next-auth' 
import Credentials from 'next-auth/providers/credentials' 
import { prisma } from '@/lib/prisma' 
import bcrypt from 'bcryptjs' 
export const authOptions = { 
session: { strategy: 'jwt' as const }, // ใช้ JWT ในคุกกี้ 
providers: [ 
Credentials({ 
name: 'credentials', 
credentials: { 
username: { label: 'Username', type: 'text' }, 
password: { label: 'Password', type: 'password' }, 
}, 
async authorize(credentials) { 
// 1) ค้นหาผู้ใช้ 
const user = await prisma.user.findUnique({ 
where: { username: credentials?.username }, 
}) 
if (!user) return null 
// 2) ตรวจรหัสผ่าน 
const ok = await bcrypt.compare(credentials!.password, user.password) 
if (!ok) return null 
// 3) คืนเฉพาะข้อมูลจําเป็น (ห้ามคืน password) 
return { id: user.id, username: user.username, role: user.role } 
}, 
}), 
 ], 
  callbacks: { 
    // เพิ่มฟิลด์ลงใน JWT ตอน login สําเร็จ 
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) { // user is only defined on the first login
        token.id = (user as any).id 
        token.username = (user as any).username 
        token.role = (user as any).role 
      } 
      return token 
    }, 
    // ส่งต่อฟิลด์จาก token → session (client จะอ่านจาก session.user) 
    async session({ session, token }: { session: any, token: any }) {
      session.user = { 
        ...(session.user || {}), 
        id: token.id as string, 
        username: token.username as string, 
        role: token.role as string, 
      } 
      return session 
    }, 
  }, 
  secret: process.env.NEXTAUTH_SECRET, 
} 
 
const handler = NextAuth(authOptions) 
export { handler as GET, handler as POST }