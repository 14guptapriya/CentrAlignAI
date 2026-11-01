'use client'
import React, { useState } from 'react'
import { apiClient } from '../../../lib/api'


export default function NewFormPage(){
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
const [prompt, setPrompt] = useState('')
const [loading, setLoading] = useState(false)
const [schema, setSchema] = useState<any>(null)


async function generate(){
if(!prompt) return alert('Write a prompt')
setLoading(true)
try{
const api = apiClient(token || undefined)
const r = await api.post('/forms/generate', { prompt })
setSchema(r.data.schema || r.data.form?.schema)
}catch(e:any){ alert(e?.response?.data?.error || e.message) }
setLoading(false)
}


return (
<div>
<h2>AI Form Generator</h2>
<textarea value={prompt} onChange={e=>setPrompt(e.target.value)} style={{ width:'100%', minHeight:120 }} placeholder="E.g. 'Create a job application form with resume upload and GitHub link'" />
<div style={{ marginTop:8 }}>
<button onClick={generate} disabled={loading}>{loading?'Generating...':'Generate schema'}</button>
</div>


{schema && (
<div style={{ marginTop:20 }}>
<h3>Generated Schema</h3>
<pre style={{ whiteSpace:'pre-wrap', maxHeight:400, overflow:'auto' }}>{JSON.stringify(schema, null, 2)}</pre>
<p>Refresh dashboard to see the saved form.</p>
</div>
)}
</div>
)
}