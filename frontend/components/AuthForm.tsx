/* components/AuthForm.tsx */
'use client'
import React, { useState } from 'react'
import { apiClient } from '../lib/api'


export default function AuthForm({ onLogin }: { onLogin: (token: string) => void }){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [mode, setMode] = useState<'login'|'register'>('login')
const [loading, setLoading] = useState(false)


async function submit(){
setLoading(true)
try{
const api = apiClient()
if(mode === 'register'){
await api.post('/auth/register', { email, password })
setMode('login')
} else {
const r = await api.post('/auth/login', { email, password })
const token = r.data.token
localStorage.setItem('token', token)
onLogin(token)
}
}catch(e:any){ alert(e?.response?.data?.error || e.message) }
setLoading(false)
}


return (
<div style={{ maxWidth:420, padding:12, border:'1px solid #eee', borderRadius:8 }}>
<h3>{mode==='login'?'Login':'Register'}</h3>
<input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', marginBottom:8 }} />
<input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', marginBottom:8 }} />
<div style={{ display:'flex', gap:8 }}>
<button onClick={submit} disabled={loading}>{mode==='login'?'Login':'Create account'}</button>
<button onClick={()=>setMode(mode==='login'?'register':'login')} style={{ background:'#eee', color:'#111' }}>{mode==='login'?'Need account?':'Already have account?'}</button>
</div>
</div>
)
}