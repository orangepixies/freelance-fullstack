// components/CategorySection.tsx
import 'server-only'
import { cookies } from 'next/headers'
import { getBaseUrl } from '@/lib/baseUrl'
import CategoryTabs from './CategoryTabs' // Client Component

export default async function CategorySection() {
  const c = await cookies()
  const lang = (c.get('lang')?.value || 'en').toLowerCase()
  const base = await getBaseUrl()

  let initial: any[] = []
  try {
    const res = await fetch(`${base}/api/news/by-category?category=general&lang=${lang}`, {
      next: { revalidate: 300 },
    })
    if (res.ok) {
      const json = await res.json()
      initial = json.articles || []
    }
  } catch {
    // silent fallback
  }

  return <CategoryTabs initialItems={initial} initialValue="general" />
}
