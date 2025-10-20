// Server Component
type Article = {
  title: string
  description?: string | null
  url: string
  urlToImage?: string | null
  source?: { name?: string }
}

import NewsCard from '@/components/NewsCard'

export default async function NewsSection() {
  // Requires a free key from https://newsapi.org
  const key = process.env.NEWS_API_KEY
  if (!key) {
    return (
      <section className="container mt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">World News</h2>
        <p className="text-muted text-center">Add NEWS_API_KEY in .env.local to load live headlines.</p>
      </section>
    )
  }

  const url =
    'https://newsapi.org/v2/top-headlines?language=en&pageSize=6&sortBy=publishedAt'

  const res = await fetch(url, {
    headers: { 'X-Api-Key': key },
    // revalidate every 30 minutes (ISR)
    next: { revalidate: 60 * 30 },
  })

  if (!res.ok) {
    return (
      <section className="container mt-24">
        <h2 className="text-4xl font-bold mb-2 text-center">World News</h2>
        <p className="text-muted text-center">Failed to load headlines.</p>
      </section>
    )
  }

  const data = await res.json()
  const articles: Article[] = (data?.articles || []).filter(
    (a: any) => a?.title && a?.url
  )

  return (
    <section className="container mt-24">
      <h2 className="text-4xl font-bold mb-2 text-center">World News</h2>
      <p className="text-muted mb-10 text-center">Latest global headlines</p>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <NewsCard
            key={`${i}-${a.url}`}
            title={a.title}
            description={a.description || ''}
            url={a.url}
            imageUrl={a.urlToImage || null}
            source={a.source?.name || ''}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <a
          href="https://news.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          See More
        </a>
      </div>
    </section>
  )
}
