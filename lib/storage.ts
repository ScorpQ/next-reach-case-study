import { Lead } from '@/types'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const LEADS_FILE = join(DATA_DIR, 'leads.json')

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

export function getLeads(): Lead[] {
  ensureDir()
  if (!existsSync(LEADS_FILE)) return []
  try {
    return JSON.parse(readFileSync(LEADS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export function saveLead(lead: Lead): void {
  ensureDir()
  const leads = getLeads()
  leads.unshift(lead)
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export function updateLeadStatus(id: string, updates: Partial<Lead>): Lead | null {
  ensureDir()
  const leads = getLeads()
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return null
  leads[idx] = { ...leads[idx], ...updates }
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))
  return leads[idx]
}
