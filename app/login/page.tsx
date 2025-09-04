'use client' 
import { useState } from 'react' 
import { useRouter } from 'next/navigation' 
import { signIn } from 'next-auth/react' 
 
export default function LoginPage() { 
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('') 
  const router = useRouter() 
 
  const onLogin = async (e: React.FormEvent) => { 
    e.preventDefault() 
    setError('') 
    const res = await signIn('credentials', { username, password, redirect: false }) 
    if (res?.ok) router.push('/dashboard') 
    else setError('เข้าสู่ระบบไม่สําเร็จ') 
  } 
 return ( 
    <div className="max-w-sm mx-auto p-6"> 
      <h1 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h1> 
      <form onSubmit={onLogin} className="space-y-3"> 
        <input className="w-full border p-2 rounded" placeholder="Username" 
               value={username} onChange={e => setUsername(e.target.value)} required /> 
        <input className="w-full border p-2 rounded" placeholder="Password" 
type="password" 
               value={password} onChange={e => setPassword(e.target.value)} required /> 
        {error && <p className="text-red-600 text-sm">{error}</p>} 
        <button className="bg-green-600 text-white px-4 py-2 rounded">เข้าสู่ระบบ</button> 
      </form> 
    </div> 
  ) 
} 