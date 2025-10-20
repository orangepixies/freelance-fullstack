// lib/posts.ts
import 'server-only'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export type PostMeta = {
  slug: string
  title: string
  date: string         // ISO
  excerpt: string
  imageUrl?: string
  category?: string
  tags?: string[]
  readingMinutes: number
}

export type Post = PostMeta & { html: string }

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

function firstImageFromMarkdown(md: string): string | undefined {
  // ambil ![alt](url)
  const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/)
  return m?.[1]
}

function readingMinutes(text: string) {
  const words = (text || '').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = (await fs.readdir(POSTS_DIR)).filter(f => f.endsWith('.md'))
  const items = await Promise.all(files.map(async (file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8')
    const { data, content } = matter(raw)

    const title = String(data.title || slug)
    const date  = String(data.date || new Date().toISOString())
    const excerpt = String(data.excerpt || content.slice(0, 140).replace(/\n/g,' ') + '…')
    const imageUrl = String(data.image || firstImageFromMarkdown(content) || '')
    const category = String(data.category || 'General')
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : []
    const reading = readingMinutes(content)

    return { slug, title, date, excerpt, imageUrl, category, tags, readingMinutes: reading }
  }))

  return items.sort((a,b)=> +new Date(b.date) - +new Date(a.date))
}

export async function getPost(slug: string): Promise<Post> {
  const raw = await fs.readFile(path.join(POSTS_DIR, slug + '.md'),'utf8')
  const { data, content } = matter(raw)
  const html = String(marked.parse(content))

  const title = String(data.title || slug)
  const date  = String(data.date || new Date().toISOString())
  const excerpt = String(data.excerpt || content.slice(0,140).replace(/\n/g,' ') + '…')
  const imageUrl = String(data.image || firstImageFromMarkdown(content) || '')
  const category = String(data.category || 'General')
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : []
  const reading = readingMinutes(content)

  return { slug, title, date, excerpt, imageUrl, category, tags, readingMinutes: reading, html }
}

export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const set = new Set(posts.map(p => p.category || 'General'))
  return ['All', ...Array.from(set).sort()]
}
