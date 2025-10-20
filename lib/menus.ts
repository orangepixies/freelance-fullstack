// lib/menus.ts
export type AppRole = 'ADMIN' | 'LECTURER' | 'STUDENT' | 'GUEST'
export type MenuItem = { key: string; label: string; href: string; only?: AppRole[] }

/**
 * Daftar menu. Jika `only` tidak diisi => publik (muncul untuk semua role).
 * Jika `only` diisi => hanya muncul untuk role yang termasuk.
 */
const ALL_ITEMS: MenuItem[] = [
  // publik
  { key: 'about',     label: 'About',     href: '/about' },
  { key: 'services',  label: 'Services',  href: '/services' },
  { key: 'works',     label: 'Works',     href: '/works' },
  { key: 'tech',      label: 'Tech',      href: '/tech' },
  { key: 'process',   label: 'Process',   href: '/process' },
  { key: 'contact',   label: 'Contact',   href: '/contact' },
  { key: 'blog',      label: 'Blog',      href: '/blog' },

  // role-based
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', only: ['STUDENT','LECTURER','ADMIN'] },
  { key: 'admin',     label: 'Admin',     href: '/admin',     only: ['ADMIN'] },
]

export function getMenuForRole(role?: string): MenuItem[] {
  const r = (role?.toUpperCase() as AppRole) || 'GUEST'
  return ALL_ITEMS.filter(item => !item.only || item.only.includes(r))
}
