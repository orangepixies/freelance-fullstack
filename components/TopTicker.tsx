// Server Component
import NewsTicker from './NewsTicker'

export default async function TopTicker() {
  const key = process.env.NEWS_API_KEY
  if (!key) return null

  const res = await fetch(
    'https://newsapi.org/v2/top-headlines?language=en&pageSize=12&sortBy=publishedAt',
    { headers: { 'X-Api-Key': key }, next: { revalidate: 60 * 10 } }
  )
  if (!res.ok) return null

  const data = await res.json()
  const items = (data?.articles ?? [])
    .filter((a: any) => a?.title && a?.url)
    .map((a: any) => ({ title: a.title as string, url: a.url as string }))

  if (!items.length) return null
  return <NewsTicker items={items} />
}
