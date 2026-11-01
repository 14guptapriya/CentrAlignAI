/* app/form/[id]/page.tsx (Public form renderer) */
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FileUploader from '../../../components/FileUploader'
import { apiClient } from '../../../lib/api'


export default function PublicForm({ params }:{ params: { id: string } }){
const id = params.id
const [form, setForm] = useState<any>(null)
const [values, setValues] = useState<Record<string, any>>({})
const [loading, setLoading] = useState(false)


useEffect(()=>{ fetchForm() }, [id])


async function fetchForm(){
try{
const api = apiClient()
const r = await api.get(`/forms/${id}`)
setForm(r.data)
}catch(e){ console.error(e) }
}


function onChangeField(name:string, value:any){ setValues(prev=>({ ...prev, [name]: value })) }


async function submit(){
setLoading(true)
try{
const api = apiClient()
await api.post(`/submit/${id}`, values)
alert('Submitted')
setValues({})
}catch(e:any){ alert(e?.response?.data?.error || e.message) }
setLoading(false)
}


if(!form) return <div>Loading...</div>


const fields = form.schemaJson?.fields || form.schema?.fields || []


return (
<div>
<h2>{form.title || 'Form'}</h2>
<p>{form.description}</p>
<div>
{fields.map((f:any)=>(
<div key={f.name} style={{ marginBottom:12 }}>
<label style={{ display:'block', marginBottom:6 }}>{f.label || f.name}{f.required?' *':''}</label>
{f.type === 'text' && <input value={values[f.name]||''} onChange={e=>onChangeField(f.name, e.target.value)} />}
{f.type === 'email' && <input type="email" value={values[f.name]||''} onChange={e=>onChangeField(f.name, e.target.value)} />}
{f.type === 'number' && <input type="number" value={values[f.name]||''} onChange={e=>onChangeField(f.name, e.target.value)} />}
{f.type === 'textarea' && <textarea value={values[f.name]||''} onChange={e=>onChangeField(f.name, e.target.value)} />}
{f.type === 'select' && (
<select value={values[f.name]||''} onChange={e=>onChangeField(f.name, e.target.value)}>
<option value="">Select...</option>
{(f.options||[]).map((o:string)=> <option key={o} value={o}>{o}</option>)}
</select>
)}
{f.type === 'file' && <FileUploader token={localStorage.getItem('token')||undefined} onUploaded={(url)=>onChangeField(f.name, url)} />}
</div>
))}
</div>
<div>
<button onClick={submit} disabled={loading}>{loading?'Submitting...':'Submit'}</button>
</div>
</div>
)
}

