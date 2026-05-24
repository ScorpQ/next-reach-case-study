import { Lead } from '@/types'

export function scoreLead(data: Partial<Lead>): 'hot' | 'warm' | 'cold' {
  let pts = 0

  if (data.email) pts += 3
  if (data.company) pts += 2
  if (data.painPoint && data.painPoint.length > 15) pts += 2

  if (data.timeline) {
    const t = data.timeline.toLowerCase()
    if (t.includes('hemen') || t.includes('acil') || t.includes('bu ay')) pts += 3
    else if (t.includes('çeyrek') || t.includes('3 ay') || t.includes('yakın')) pts += 2
    else pts += 1
  }

  if (data.companySize) {
    const s = data.companySize.toLowerCase()
    if (s.includes('500') || s.includes('büyük') || s.includes('enterprise')) pts += 3
    else if (s.includes('100') || s.includes('orta')) pts += 2
    else pts += 1
  }

  if (data.role) {
    const r = data.role.toLowerCase()
    if (r.includes('ceo') || r.includes('cto') || r.includes('founder') || r.includes('direktör') || r.includes('müdür')) pts += 2
    else pts += 1
  }

  if (pts >= 10) return 'hot'
  if (pts >= 5) return 'warm'
  return 'cold'
}
