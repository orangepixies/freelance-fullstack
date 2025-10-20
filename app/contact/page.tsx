'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLang } from '@/components/i18n/LanguageProvider'

const fade = (d=0)=>({
  initial:{opacity:0,y:16},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,amount:.25},
  transition:{duration:.5,delay:d}
})

type MemberKey = 'kenny'|'aisha'|'amanda'|'christopher'
const TEAM: { key:MemberKey; name:string; roleEN:string; roleID:string; photo:string }[] = [
  {
    key: 'kenny',
    name: 'Kenny',
    roleEN: 'Lead Full-Stack',
    roleID: 'Lead Full-Stack',
    photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'aisha',
    name: 'Aisha',
    roleEN: 'Product & UX',
    roleID: 'Produk & UX',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'amanda',
    name: 'Amanda',
    roleEN: 'Frontend Engineer',
    roleID: 'Engineer Frontend',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'christopher',
    name: 'Christopher',
    roleEN: 'Backend & DevOps',
    roleID: 'Backend & DevOps',
    photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1200&q=80'
  },
]

export default function ContactPage(){
  const { lang } = useLang()
  const t = (en:string, id:string)=> lang==='id' ? id : en
  const [assignee, setAssignee] = useState<MemberKey>('kenny')

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="container text-center py-14">
        <motion.h1 {...fade()} className="text-5xl md:text-6xl font-extrabold">
          {t('Contact','Kontak')}
        </motion.h1>
        <motion.p {...fade(.06)} className="text-zinc-300 mt-3 max-w-2xl mx-auto">
          {t(
            'Tell us about your project—pick a teammate to route your message.',
            'Ceritakan proyekmu—pilih anggota tim sebagai tujuan pesan.'
          )}
        </motion.p>
      </section>

      {/* TEAM GRID */}
      <section className="container">
        <div className="grid md:grid-cols-4 gap-5">
          {TEAM.map((m,i)=>(
            <motion.button
              key={m.key}
              {...fade(i*0.05)}
              onClick={()=>setAssignee(m.key)}
              className={`group relative overflow-hidden rounded-2xl border transition ${
                assignee===m.key ? 'border-accent shadow-glow' : 'border-line hover:border-zinc-400'
              }`}
            >
              <div className="relative w-full h-60">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-white font-semibold text-lg">{m.name}</div>
                  <div className="text-zinc-300 text-sm">
                    {lang==='id' ? m.roleID : m.roleEN}
                  </div>
                </div>
              </div>
              {assignee===m.key && (
                <div className="absolute top-3 left-3 badge bg-accent text-black border-accent">
                  {t('Selected','Terpilih')}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="container mt-10 mb-24 grid md:grid-cols-2 gap-6">
        <motion.div {...fade()} className="card p-6">
          <div className="text-xl font-semibold mb-2">
            {t('Project brief','Ringkas proyek')}
          </div>
          <p className="text-zinc-300">
            {t('We respond within 24 hours. Choosing a teammate helps us route faster.',
               'Kami balas maks. 24 jam. Memilih anggota tim membantu routing lebih cepat.')}
          </p>
          <ul className="text-zinc-300 mt-3 space-y-1">
            <li>• {t('Goal & timeline','Tujuan & timeline')}</li>
            <li>• {t('Key features / sections','Fitur/section kunci')}</li>
            <li>• {t('Any constraints (budget, legacy, etc.)','Constraint (budget, legacy, dll.)')}</li>
          </ul>
        </motion.div>

        <motion.div {...fade(.06)} className="card p-6">
          <TeamContactForm assignee={assignee} onAssigneeChange={setAssignee} />
        </motion.div>
      </section>
    </main>
  )
}

/** FORM (client) */
function TeamContactForm({ assignee, onAssigneeChange }:{
  assignee: MemberKey
  onAssigneeChange: (m:MemberKey)=>void
}){
  const { lang } = useLang()
  const t = (en:string, id:string)=> lang==='id' ? id : en

  const [loading,setLoading]=useState(false)
  const [ok,setOk]=useState<string|null>(null)

  async function onSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setLoading(true); setOk(null)
    const form = e.currentTarget
    const data = {
      to: (form.elements.namedItem('to') as HTMLInputElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try{
      const res = await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })
      const j = await res.json()
      if (j.ok) { setOk('sent'); form.reset() }
      else setOk(j.error || 'failed')
    }catch(err:any){
      setOk(err?.message || 'failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {/* assignee select (radio) */}
      <div>
        <div className="text-sm text-muted mb-1">{t('Send to','Kirim ke')}</div>
        <div className="grid grid-cols-2 gap-2">
          {['kenny','aisha','amanda','christopher'].map((k)=>(
            <label key={k} className={`cursor-pointer card px-4 py-3 flex items-center gap-2 ${assignee===k ? 'border-accent' : ''}`}>
              <input
                type="radio"
                name="to"
                value={k}
                checked={assignee===k}
                onChange={()=>onAssigneeChange(k as MemberKey)}
              />
              <span className="capitalize">{k}</span>
            </label>
          ))}
        </div>
      </div>

      <input name="name" required placeholder={t('Your name','Namamu')} className="card px-4 py-3"/>
      <input name="email" required type="email" placeholder="Email" className="card px-4 py-3"/>
      <textarea name="message" required placeholder={t('Tell us about your project…','Ceritakan proyekmu…')} className="card px-4 py-3 min-h-32"/>
      <button disabled={loading} className="btn disabled:opacity-60">{loading? t('Sending…','Mengirim…'): t('Send Message','Kirim Pesan')}</button>
      {ok && <div className="text-sm text-muted">{ok==='sent'? t('Thanks! We’ll reply soon.','Terima kasih! Kami segera membalas.'): `Error: ${ok}`}</div>}
    </form>
  )
}
