import NextAuth, { AuthOptions } from 'next-auth' 
import Credentials from 'next-auth/providers/credentials' 
import { prisma } from '@/lib/prisma' 
import { User as PrismaUser } from '@/app/generated/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = { 
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
return { id: user.id, username: user.username, role: user.role, image: user.image }
}, 
}), 
 ], 
  callbacks: { 
    // เพิ่มฟิลด์ลงใน JWT ตอน login สําเร็จ 
    async jwt({ token, user, trigger, session }) {
      // Handle session update trigger from client
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      if (user) { // user is only defined on the first login
        token.id = user.id 
        token.username = user.username 
        token.role = user.role
        token.image = user.image
      } 
      return token 
    }, 
    // ส่งต่อฟิลด์จาก token → session (client จะอ่านจาก session.user) 
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.image = token.image;
      return session;
    },
  }, 
  secret: process.env.NEXTAUTH_SECRET, 
} 
 
const handler = NextAuth(authOptions) 
export { handler as GET, handler as POST }
