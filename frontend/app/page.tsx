/* app/page.tsx (Dashboard) */
'use client'
import React, { useEffect, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { apiClient } from '../lib/api'


export default function Dashboard(){
const [token, setToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
const [forms, setForms] = useState<any[]>([])


useEffect(()=>{ if(token){ fetchForms() } }, [token])


async function fetchForms(){
try{
const api = apiClient(token || undefined)
const r = await api.get('/forms')
setForms(r.data)
}catch(e){ console.error(e) }
}


if(!token) return <AuthForm onLogin={(t)=>{ setToken(t); window.location.reload() }} />


return (
<div>
<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
<h2>Your forms</h2>
<a href="/forms/new"><button>Create new form</button></a>
</div>
<div style={{ marginTop:12 }}>
{forms.length === 0 && <p>No forms yet</p>}
{forms.map(f => (
<div key={f._id} style={{ border:'1px solid #eee', padding:12, marginBottom:8 }}>
<h3>{f.title}</h3>
<p>{f.description}</p>
<div>
<a href={`/form/${f._id}`}>Open public form</a>
</div>
</div>
))}
</div>
</div>
)
}