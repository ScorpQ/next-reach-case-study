'use client'

import { useEffect, useState } from 'react'
import { Lead } from '@/types'
import { BarChart3, Flame, Thermometer, Snowflake, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  new: 'Yeni',
  contacted: 'İletişime geçildi',
  qualified: 'Nitelikli',
  disqualified: 'Uygun değil',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  qualified: 'bg-green-50 text-green-700',
  disqualified: 'bg-slate-100 text-slate-500',
}

function ScoreBadge({ score }: { score: Lead['score'] }) {
  if (score === 'hot') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
      <Flame className="h-3 w-3" /> Sıcak
    </span>
  )
  if (score === 'warm') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
      <Thermometer className="h-3 w-3" /> Ilık
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
      <Snowflake className="h-3 w-3" /> Soğuk
    </span>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Az önce'
  if (mins < 60) return `${mins} dk önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} sa önce`
  return `${Math.floor(hrs / 24)} gün önce`
}

function LeadRow({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: string, status: Lead['status']) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b last:border-b-0">
      <div
        className="flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-[hsl(210,40%,96.1%)]"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Score */}
        <div className="w-20 shrink-0">
          <ScoreBadge score={lead.score} />
        </div>

        {/* Name + company */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {lead.name || <span className="text-muted-foreground italic">İsimsiz</span>}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {[lead.company, lead.role].filter(Boolean).join(' · ') || 'Şirket belirtilmedi'}
          </p>
        </div>

        {/* Email */}
        <div className="hidden w-44 shrink-0 md:block">
          <p className="truncate text-xs text-muted-foreground">{lead.email || '—'}</p>
        </div>

        {/* Intent */}
        <div className="hidden w-20 shrink-0 text-xs text-muted-foreground md:block">
          {lead.intent || '—'}
        </div>

        {/* Status */}
        <div className="w-36 shrink-0" onClick={(e) => e.stopPropagation()}>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
            className={cn(
              'w-full rounded-md border-0 px-2 py-1 text-xs font-medium outline-none ring-1 ring-inset ring-transparent focus:ring-slate-300',
              STATUS_COLORS[lead.status]
            )}
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground md:block">
          {timeAgo(lead.createdAt)}
        </div>

        {/* Expand icon */}
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-[hsl(210,40%,96.1%)] px-6 py-5">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Summary */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Özet</h4>
              <p className="text-sm leading-relaxed text-foreground">
                {lead.conversationSummary || 'Özet oluşturulmadı.'}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Şirket büyüklüğü', value: lead.companySize },
                  { label: 'Mevcut araç', value: lead.currentTool },
                  { label: 'Zaman çerçevesi', value: lead.timeline },
                  { label: 'Niyet', value: lead.intent },
                ].map((item) => item.value && (
                  <div key={item.label}>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pain point + conversation */}
            <div>
              {lead.painPoint && (
                <div className="mb-4">
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sorun / İhtiyaç</h4>
                  <p className="rounded-md border-l-2 border-[hsl(186,34%,28%)] bg-white pl-3 py-2 text-sm text-foreground leading-relaxed">
                    {lead.painPoint}
                  </p>
                </div>
              )}

              {lead.rawConversation && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Konuşma</h4>
                  <pre className="max-h-40 overflow-y-auto rounded-md bg-white p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {lead.rawConversation}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Lead['score']>('all')

  async function fetchLeads() {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch {
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  async function handleStatusChange(id: string, status: Lead['status']) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.score === filter)

  const counts = {
    hot: leads.filter((l) => l.score === 'hot').length,
    warm: leads.filter((l) => l.score === 'warm').length,
    cold: leads.filter((l) => l.score === 'cold').length,
    new: leads.filter((l) => l.status === 'new').length,
  }

  return (
    <div className="min-h-screen bg-[hsl(210,40%,96.1%)]">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[hsl(222.2,47.4%,11.2%)]">
                <BarChart3 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">NextReach</span>
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">İletişim Talepleri</span>
          </div>
          <button
            onClick={fetchLeads}
            className="inline-flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <RefreshCw className="h-3 w-3" />
            Yenile
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Toplam talep', value: leads.length, color: 'text-foreground' },
            { label: 'Yeni', value: counts.new, color: 'text-blue-600' },
            { label: 'Sıcak lead', value: counts.hot, color: 'text-orange-600' },
            { label: 'Ilık lead', value: counts.warm, color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4">
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex gap-2">
          {([['all', 'Tümü'], ['hot', 'Sıcak'], ['warm', 'Ilık'], ['cold', 'Soğuk']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === val
                  ? 'bg-[hsl(222.2,47.4%,11.2%)] text-white'
                  : 'bg-white border hover:bg-muted text-muted-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-white overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b bg-[hsl(210,40%,96.1%)] px-6 py-2.5">
            <div className="w-20 shrink-0 text-xs font-medium text-muted-foreground">Skor</div>
            <div className="flex-1 text-xs font-medium text-muted-foreground">Kişi</div>
            <div className="hidden w-44 shrink-0 text-xs font-medium text-muted-foreground md:block">E-posta</div>
            <div className="hidden w-20 shrink-0 text-xs font-medium text-muted-foreground md:block">Niyet</div>
            <div className="w-36 shrink-0 text-xs font-medium text-muted-foreground">Durum</div>
            <div className="hidden w-24 shrink-0 text-right text-xs font-medium text-muted-foreground md:block">Zaman</div>
            <div className="w-4 shrink-0" />
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Yükleniyor...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Henüz talep yok.
            </div>
          ) : (
            filtered.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
