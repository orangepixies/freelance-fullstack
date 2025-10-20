import LoginForm from '@/components/auth/LoginForm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth-token' // ← update import

export default async function LoginPage() {
  const store = await cookies()
  const token = store.get('session')?.value
  const user = await getUserFromCookie(token)
  if (user) redirect('/dashboard')

  return (
    <main className="container py-20">
      <h1 className="text-3xl font-bold text-center mb-8">Sign in</h1>
      <LoginForm />
    </main>
  )
}
