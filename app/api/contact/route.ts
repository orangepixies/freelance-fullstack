// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Client } from '@notionhq/client'

const TEAM_EMAIL: Record<string, string | undefined> = {
  kenny: process.env.TEAM_KENNY_EMAIL,
  aisha: process.env.TEAM_AISHA_EMAIL,
  amanda: process.env.TEAM_AMANDA_EMAIL,
  christopher: process.env.TEAM_CHRISTOPHER_EMAIL,
}

export async function POST(req: Request){
  try{
    const { to, name, email, message } = await req.json()
    if(!name || !email || !message) {
      return NextResponse.json({ ok:false, error:'Missing fields' }, { status: 400 })
    }

    const assignee = (String(to||'').toLowerCase()) as keyof typeof TEAM_EMAIL
    const mailTo = TEAM_EMAIL[assignee] || process.env.MAIL_TO

    const tasks: Promise<any>[] = []

    // Email (Nodemailer)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && mailTo){
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT||587),
        secure: Boolean(process.env.SMTP_SECURE==='true'),
        auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
      })
      tasks.push(transporter.sendMail({
        from: `Portfolio <${process.env.MAIL_FROM||process.env.SMTP_USER}>`,
        to: mailTo,
        subject: `New inquiry (${assignee || 'unassigned'}) from ${name}`,
        text: `To: ${assignee || 'unassigned'}\nFrom: ${name} <${email}>\n\n${message}`
      }))
    }

    // Telegram
    if (process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID){
      const tgUrl = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`
      tasks.push(fetch(tgUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: `\u2709\uFE0F New Inquiry\nTo: ${assignee||'unassigned'}\nFrom: ${name} <${email}>\n\n${message}`
      }) }))
    }

    // Notion
    if (process.env.NOTION_TOKEN && process.env.NOTION_DB){
      const notion = new Client({ auth: process.env.NOTION_TOKEN })
      tasks.push(notion.pages.create({
        parent: { database_id: process.env.NOTION_DB! },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Email: { email },
          Status: { select: { name: 'New' } },
          Assignee: { select: { name: assignee || 'unassigned' } } // pastikan opsi ada di DB
        },
        children: [ { object:'block', type:'paragraph', paragraph:{ rich_text:[{ type:'text', text:{ content: message } }] } } ]
      }))
    }

    await Promise.all(tasks)
    return NextResponse.json({ ok:true })
  }catch(err:any){
    console.error(err)
    return NextResponse.json({ ok:false, error: err?.message || 'Unknown error' }, { status: 500 })
  }
}
