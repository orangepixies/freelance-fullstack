'use client'
import { useState } from 'react'

export default function ContactForm(){
  const [loading,setLoading]=useState(false)
  const [ok,setOk]=useState<string|null>(null)

  async function onSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setLoading(true); setOk(null)
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    const res = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})
    const r = await res.json()
    setOk(r.ok ? 'sent' : (r.error||'failed'))
    setLoading(false)
    if (r.ok) form.reset()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input name="name" required placeholder="Your name" className="card px-4 py-3"/>
      <input name="email" required type="email" placeholder="Email" className="card px-4 py-3"/>
      <textarea name="message" required placeholder="Tell me about your project" className="card px-4 py-3 min-h-32"/>
      <button disabled={loading} className="btn disabled:opacity-60">{loading? 'Sending…':'Send Message'}</button>
      {ok && <div className="text-sm text-muted">{ok==='sent'?'Thanks! I will reply soon.':`Error: ${ok}`}</div>}
    </form>
  )
}