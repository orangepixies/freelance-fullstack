import { getAllPosts, getPost } from '@/lib/posts'
import Image from 'next/image'
import Link from 'next/link'

export async function generateStaticParams(){
  const all = await getAllPosts()
  return all.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPost(slug)
  return { title: p.title, description: p.excerpt }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPost(slug)
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative h-[46svh] grid place-items-end">
        <div className="absolute inset-0">
          <Image
            src={p.imageUrl && p.imageUrl.length>6 ? p.imageUrl : '/placeholder.jpg'}
            alt={p.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 container p-6">
          <div className="badge mb-2">{p.category || 'General'}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold max-w-4xl">{p.title}</h1>
          <div className="text-sm text-zinc-300 mt-2">
            {new Date(p.date).toLocaleDateString()} · {p.readingMinutes} min read
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="container py-10">
        <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: p.html }} />
        <div className="mt-10">
          <Link href="/blog" className="link-underline">← Back to Blog</Link>
        </div>
      </section>
    </main>
  )
}
