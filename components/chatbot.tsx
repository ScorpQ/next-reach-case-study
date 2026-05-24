'use client'

import { useEffect, useRef, useState } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Message } from '@/types'

function randomId() {
  return Math.random().toString(36).slice(2)
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Merhaba! 👋 Ben NextReach\'in dijital asistanıyım. Analitik dashboard\'larımız hakkında bilgi almak mı, demo görmek mi, yoksa başka bir konuda mı yardımcı olabilirim?',
  timestamp: new Date().toISOString(),
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: randomId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      // Build messages for API (exclude welcome, use proper format)
      const apiMessages = next
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()

      const assistantMsg: Message = {
        id: randomId(),
        role: 'assistant',
        content: data.content || 'Bir hata oluştu, lütfen tekrar deneyin.',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMsg])

      // If lead data extracted and not yet saved
      if (data.leadData && !leadSaved) {
        setLeadSaved(true)
        const allMessages = [...next, assistantMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }))

        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadData: data.leadData, messages: allMessages }),
        })
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          role: 'assistant',
          content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[hsl(222.2,47.4%,11.2%)] px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl',
          open && 'opacity-0 pointer-events-none'
        )}
        aria-label="İletişime geç"
      >
        <MessageCircle className="h-4 w-4" />
        Bize Ulaşın
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-xl border bg-white shadow-2xl transition-all duration-300',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ height: '560px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b bg-[hsl(222.2,47.4%,11.2%)] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">NextReach</p>
              <p className="text-xs text-white/60">Genellikle anında yanıt verir</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex animate-fade-in-up',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-[hsl(222.2,47.4%,11.2%)] text-white'
                    : 'rounded-bl-sm bg-[hsl(210,40%,96.1%)] text-[hsl(222.2,47.4%,11.2%)]'
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="rounded-2xl rounded-bl-sm bg-[hsl(210,40%,96.1%)] px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t px-3 py-3">
          <div className="flex items-center gap-2 rounded-lg border bg-[hsl(210,40%,96.1%)] px-3 py-2 focus-within:border-slate-400 focus-within:bg-white transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Mesajınızı yazın..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[hsl(222.2,47.4%,11.2%)] text-white transition-opacity disabled:opacity-30 hover:bg-slate-800"
              aria-label="Gönder"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            NextReach · Güvenli bağlantı
          </p>
        </div>
      </div>
    </>
  )
}
