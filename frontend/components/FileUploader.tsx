/* components/FileUploader.tsx */
'use client'
import React, { useState } from 'react'
import { apiClient } from '../lib/api'


export default function FileUploader({ onUploaded, token }:{ onUploaded:(url:string)=>void, token?:string }){
const [file, setFile] = useState<File | null>(null)
const [loading, setLoading] = useState(false)


async function upload(){
if(!file) return alert('Select file')
setLoading(true)
try{
// Request backend upload endpoint
const api = apiClient(token)
const form = new FormData()
form.append('file', file)
const r = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
onUploaded(r.data.url)
}catch(e:any){ alert(e?.response?.data?.error || e.message) }
setLoading(false)
}


return (
<div>
<input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
<button onClick={upload} disabled={loading}>{loading?'Uploading...':'Upload'}</button>
</div>
)
}