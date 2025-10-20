// app/page.tsx (SERVER)
import Hero from '@/components/Hero'            // your parallax+blur hero (kept)
import TopTicker from '@/components/TopTicker'  // server → client marquee
import TopStories from '@/components/TopStories'
import CategorySection from '@/components/CategorySection'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // const users = await prisma.user.findMany();
  // console.log(users, 'users');

  return (
    <main className="overflow-hidden">
      <Hero />

      {/* World News Ticker */}
      <TopTicker />

      {/* Top Stories grid */}
      <TopStories />

      {/* Categories with client tabs */}
      <CategorySection />

      {/* Contact */}
      <section id="contact" className="container mt-28 grid md:grid-cols-2 gap-6 pb-24">
        <Reveal>
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Let’s work together</h3>
            <p className="text-muted">Need a fast news portal or data dashboard? I can help.</p>
            <div className="mt-4 text-sm"><div className="badge">1 slot open this month</div></div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="card p-6">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </main>
  )
}
