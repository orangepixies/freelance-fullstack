// app/blog/page.tsx (SERVER)
import { getAllPosts, getCategories } from '@/lib/posts'
import BlogIndex from '@/components/BlogIndex'
import { cookies } from 'next/headers'
import Reveal from '@/components/Reveal' // <- CLIENT wrapper untuk animasi

export default async function BlogPage(){
  const posts = await getAllPosts()
  const categories = await getCategories()

  const store = await cookies()
  const lang = (store.get('lang')?.value?.toLowerCase()==='id') ? 'id' : 'en'
  const t = (en:string,id:string)=> lang==='id'? id : en

  return (
    <main className="overflow-hidden">
      <section className="container text-center py-14">
        <Reveal>
          <h1 className="text-5xl md:text-6xl font-extrabold">
            {t('Blog','Blog')}
          </h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="text-zinc-300 mt-3 max-w-2xl mx-auto">
            {t('Notes on building content-driven products and platforms.',
               'Catatan membangun produk & platform berbasis konten.')}
          </p>
        </Reveal>
      </section>

      <BlogIndex posts={posts} categories={categories} />
    </main>
  )
}
