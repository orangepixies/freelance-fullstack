// components/TopStories.tsx
import { cookies } from 'next/headers'
import NewsCard from './NewsCard'
import FancyHeading from './FancyHeading'

const DOMAINS_ID =
  'kompas.com,detik.com,tempo.co,antaranews.com,cnnindonesia.com,liputan6.com,voi.id,okezone.com,tribunnews.com'
const DOMAINS_EN =
  'reuters.com,apnews.com,bbc.co.uk,cnn.com,theguardian.com,aljazeera.com,bloomberg.com,abcnews.go.com,nbcnews.com,cbsnews.com,foxnews.com'

export default async function TopStories() {
  const key = process.env.NEWS_API_KEY
  if (!key) {
    return (
      <section id="top-stories" className="container mt-20">
        <h2 className="text-4xl font-bold text-center mb-2">Top Stories</h2>
        <p className="text-muted text-center">Set NEWS_API_KEY di .env.local untuk memuat headline.</p>
      </section>
    )
  }

  const c = await cookies()
  const lang = (c.get('lang')?.value || 'en').toLowerCase()
  const isID = lang === 'id'

  const params = new URLSearchParams({
    language: isID ? 'id' : 'en',
    pageSize: '6',
    sortBy: 'publishedAt',
  })
  params.set('domains', isID ? DOMAINS_ID : DOMAINS_EN)

  const url = `https://newsapi.org/v2/everything?${params.toString()}`
  const res = await fetch(url, { headers: { 'X-Api-Key': key }, next: { revalidate: 600 } })

  if (!res.ok) {
    return (
      <section id="top-stories" className="container mt-20">
        <h2 className="text-4xl font-bold text-center mb-2">Top Stories</h2>
        <p className="text-muted text-center">Failed to load headlines (status {res.status}). Please try again.</p>
      </section>
    )
  }

  const data = await res.json()
  const articles = (data?.articles || []).map((a: any) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    imageUrl: a.urlToImage,
    source: a.source?.name ?? '',
    publishedAt: a.publishedAt,
  }))

  if (!articles.length) {
    return (
      <section id="top-stories" className="container mt-20">
        <h2 className="text-4xl font-bold text-center mb-2">Top Stories</h2>
        <p className="text-muted text-center">
          {isID ? 'Tidak ada headline ditemukan untuk Bahasa Indonesia saat ini.' : 'No headlines found at the moment.'}
        </p>
      </section>
    )
  }

  return (
    <section id="top-stories" className="container mt-20">
      <FancyHeading
        kicker={isID ? 'Pilihan Editor' : 'Editor’s Picks'}
        title={isID ? 'Berita Utama' : 'Top Stories'}
        deck={isID ? 'Headline terbaru dari berbagai sumber tepercaya.' : 'Today’s must-reads from trusted sources.'}
      />
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {articles.map((a: any, i: number) => (
          <NewsCard key={`${i}-${a.url}`} {...a} />
        ))}
      </div>
    </section>
  )
}
