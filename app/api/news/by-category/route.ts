// app/api/news/by-category/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { XMLParser } from 'fast-xml-parser'

type Article = { title?: string; description?: string; url?: string; link?: string; urlToImage?: string; enclosure?: any; source?: { name?: string }; publishedAt?: string; pubDate?: string; }

const Q_BY_CATEGORY: Record<string, string> = {
  general: '',
  business: 'business OR economy OR markets OR finance',
  technology: 'technology OR startup OR AI OR gadget',
  sports: 'sports OR football OR soccer OR basketball',
  entertainment: 'entertainment OR film OR music OR celebrity',
  health: 'health OR hospital OR vaccine',
  science: 'science OR research OR scientist',
}

// Domains utk EVERYTHING supaya valid meski q kosong
const DOMAINS_ID = 'kompas.com,detik.com,tempo.co,antaranews.com,cnnindonesia.com,liputan6.com,voi.id,okezone.com,tribunnews.com'
const DOMAINS_EN = 'reuters.com,apnews.com,bbc.co.uk,cnn.com,theguardian.com,aljazeera.com,bloomberg.com,abcnews.go.com,nbcnews.com,cbsnews.com,foxnews.com'

// RSS fallback list (minimal, tapi kuat)
const RSS_EN: Record<string, string[]> = {
  general: [
    'https://feeds.reuters.com/reuters/topNews',
    'https://feeds.bbci.co.uk/news/world/rss.xml',
  ],
  business: [
    'https://feeds.reuters.com/reuters/businessNews',
    'https://feeds.bbci.co.uk/news/business/rss.xml',
  ],
  technology: [
    'https://feeds.reuters.com/reuters/technologyNews',
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
  ],
  sports: [
    'https://feeds.reuters.com/reuters/sportsNews',
  ],
  entertainment: [
    'https://feeds.reuters.com/reuters/entertainment',
    'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
  ],
  health: [
    'https://feeds.reuters.com/reuters/healthNews',
    'https://feeds.bbci.co.uk/news/health/rss.xml',
  ],
  science: [
    'https://feeds.reuters.com/reuters/scienceNews',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  ],
}

const RSS_ID: Record<string, string[]> = {
  general: [
    'https://www.kompas.com/rss',
    'https://rss.detik.com/index.php/detikcom',
    'https://www.antaranews.com/rss/terkini.xml',
  ],
  business: [
    'https://rss.detik.com/index.php/finance',
    'https://bisnis.tempo.co/rss',
  ],
  technology: [
    'https://tekno.kompas.com/rss',
    'https://inet.detik.com/rss',
  ],
  sports: [
    'https://sport.detik.com/rss',
  ],
  entertainment: [
    'https://hot.detik.com/rss',
  ],
  health: [
    'https://health.detik.com/rss',
  ],
  science: [
    // banyak media ID tidak punya kanal science khusus; gunakan general
    'https://www.kompas.com/rss',
  ],
}

// Cache in-memory (per proses)
const g = globalThis as any
g.__NEWS_BYCAT_CACHE ??= {} as Record<string, { ts: number; items: any[] }>
const TTL = 10 * 60 * 1000 // 10 menit

export async function GET(req: Request) {
  const key = process.env.NEWS_API_KEY
  const { searchParams } = new URL(req.url)

  const requested = (searchParams.get('category') || 'general').toLowerCase()
  const category = requested === 'world' ? 'general' : requested
  const store = await cookies()
  const rawLang = (searchParams.get('lang') || store.get('lang')?.value || 'EN').toLowerCase()
  const lang: 'en' | 'id' = rawLang === 'id' ? 'id' : 'en'
  const isID = lang === 'id'
  const cacheKey = `${lang}:${category}`

  // Serve from fresh cache
  const cached = g.__NEWS_BYCAT_CACHE[cacheKey]
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ articles: cached.items })
  }

  // 1) Primary: NewsAPI EVERYTHING (dengan backoff singkat)
  let items: any[] = []
  if (key) {
    const q = Q_BY_CATEGORY[category] ?? ''
    const p = new URLSearchParams({
      language: lang,
      pageSize: '9',
      sortBy: 'publishedAt',
    })
    p.set('domains', isID ? DOMAINS_ID : DOMAINS_EN)
    if (q) { p.set('q', q); p.set('searchIn', 'title,description') }

    const url = `https://newsapi.org/v2/everything?${p.toString()}`
    const res = await fetchWithBackoff(url, { headers: { 'X-Api-Key': key } }, 2)

    if (res?.ok) {
      const data = await res.json()
      const mapped = (data?.articles || []).map((a: Article) => toItem(a))
      if (mapped.length) items = mapped
    } else if (res?.status === 429) {
      // 1b) Fallback ke top-headlines (lebih murah)
      const p2 = new URLSearchParams({ country: isID ? 'id' : 'us', pageSize: '9', category })
      const res2 = await fetchWithBackoff(`https://newsapi.org/v2/top-headlines?${p2.toString()}`, { headers: { 'X-Api-Key': key } }, 1)
      if (res2?.ok) {
        const data2 = await res2.json()
        const mapped2 = (data2?.articles || []).map((a: Article) => toItem(a))
        if (mapped2.length) items = mapped2
      }
    }
  }

  // 2) Hard fallback: RSS (gratis)
  if (!items.length) {
    const feeds = (isID ? RSS_ID : RSS_EN)[category] || (isID ? RSS_ID.general : RSS_EN.general)
    const xml = new XMLParser({ ignoreAttributes: false })
    const chunks: any[] = []

    for (const url of feeds) {
      try {
        const res = await fetchWithBackoff(url, {}, 1)
        if (res?.ok) {
          const text = await res.text()
          const json = xml.parse(text)
          // RSS 2.0
          let itemsRss = json?.rss?.channel?.item
          // Atom
          let itemsAtom = json?.feed?.entry
          const arr = (Array.isArray(itemsRss) ? itemsRss : (itemsRss ? [itemsRss] : []))
            .concat(Array.isArray(itemsAtom) ? itemsAtom : (itemsAtom ? [itemsAtom] : []))
          for (const it of arr) {
            const link = it.link?.href || it.link || it.guid || it.url
            if (!link) continue
            chunks.push({
              title: (it.title?.['#text'] || it.title || '').toString(),
              description: (it.description?.['#text'] || it.summary?.['#text'] || it.description || it.summary || '').toString(),
              url: link.toString(),
              imageUrl:
                it.enclosure?.['@_url'] ||
                it['media:content']?.['@_url'] ||
                it['media:thumbnail']?.['@_url'] ||
                undefined,
              source: new URL(link.toString()).hostname.replace(/^www\./,''),
              publishedAt: it.pubDate || it.updated || undefined,
            })
          }
        }
      } catch {}
      if (chunks.length >= 12) break
    }

    // sort by date desc, ambil 9
    items = chunks
      .filter(x => x.title && x.url)
      .sort((a,b)=> +new Date(b.publishedAt||0) - +new Date(a.publishedAt||0))
      .slice(0, 9)
  }

  // 3) Kalau tetap kosong, gunakan stale cache jika ada
  if (!items.length && cached) {
    return NextResponse.json({ articles: cached.items })
  }

  if (items.length) g.__NEWS_BYCAT_CACHE[cacheKey] = { ts: Date.now(), items }
  return NextResponse.json({ articles: items })
}

// ---- helpers ----
function toItem(a: Article) {
  return {
    title: a.title || '',
    description: a.description || '',
    url: a.url || (a.link as string) || '',
    imageUrl: a.urlToImage || a?.enclosure?.['@_url'] || '',
    source: a.source?.name ?? '',
    publishedAt: a.publishedAt || a.pubDate || '',
  }
}

async function fetchWithBackoff(url: string, init: RequestInit, retries = 1): Promise<Response | null> {
  let attempt = 0
  while (true) {
    try {
      const res = await fetch(url, init as any)
      if (res.status !== 429 || attempt >= retries) return res
      // 429: hormati Retry-After kalau ada
      const ra = Number(res.headers.get('retry-after') || 1)
      await delay(Math.min(ra, 3) * 1000)
    } catch (e) {
      if (attempt >= retries) return null
      await delay(500 * (attempt + 1))
    }
    attempt++
  }
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))
