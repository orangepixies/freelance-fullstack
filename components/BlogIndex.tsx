'use client'

import { useMemo, useState } from 'react'
import BlogCard from './BlogCard'
import { useLang } from '@/components/i18n/LanguageProvider'

export type BlogItem = {
  slug: string; title: string; date: string; excerpt: string;
  imageUrl?: string; category?: string; tags?: string[]; readingMinutes: number;
}

export default function BlogIndex({
  posts, categories
}: { posts: BlogItem[]; categories: string[] }) {
  const { lang } = useLang()
  const t = (en:string,id:string)=> lang==='id'? id : en

  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')

  const filtered = useMemo(()=>{
    const byCat = cat==='All' ? posts : posts.filter(p => (p.category||'General')===cat)
    const needle = q.trim().toLowerCase()
    if (!needle) return byCat
    return byCat.filter(p =>
      p.title.toLowerCase().includes(needle) ||
      p.excerpt.toLowerCase().includes(needle) ||
      (p.tags||[]).join(' ').toLowerCase().includes(needle)
    )
  }, [posts, cat, q])

  return (
    <>
      {/* Controls */}
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(c => (
              <button key={c} onClick={()=>setCat(c)}
                className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
                  cat===c ? 'bg-accent text-black border-accent' : 'border-line text-zinc-200 hover:border-zinc-400'
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-80">
            <input value={q} onChange={e=>setQ(e.target.value)}
              placeholder={t('Search posts…','Cari tulisan…')}
              className="w-full card px-4 py-3"/>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="container mt-8 mb-20">
        {filtered.length===0 ? (
          <div className="text-center text-muted">{t('No posts found.','Tulisan tidak ditemukan.')}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(p => <BlogCard key={p.slug} {...p} />)}
          </div>
        )}
      </section>
    </>
  )
}
