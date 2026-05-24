import { NextRequest, NextResponse } from 'next/server'
import { getLeads, saveLead, updateLeadStatus } from '@/lib/storage'
import { scoreLead } from '@/lib/scoring'
import { MOCK_LEADS } from '@/lib/mock-data'
import { Lead } from '@/types'
import { v4 as uuidv4 } from 'uuid'

const USE_MOCK = process.env.USE_MOCK_DATA === 'true'

export async function GET() {
  try {
    if (USE_MOCK) {
      return NextResponse.json({ leads: MOCK_LEADS })
    }
    const leads = await getLeads()
    return NextResponse.json({ leads: leads })
  } catch (err) {
    console.error('GET leads error:', err)
    return NextResponse.json({ leads: MOCK_LEADS })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { leadData, messages } = body

    if (!leadData) {
      return NextResponse.json({ error: 'No lead data' }, { status: 400 })
    }

    const score = scoreLead(leadData)

    const lead: Lead = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'new',
      score,
      ...leadData,
      messages: messages || [],
      rawConversation: (messages || [])
        .map((m: { role: string; content: string }) =>
          `${m.role === 'user' ? 'Ziyaretçi' : 'NextReach'}: ${m.content}`
        )
        .join('\n\n'),
    }

    if (!USE_MOCK) {
      await saveLead(lead)
    }

    return NextResponse.json({ success: true, lead })
  } catch (err) {
    console.error('POST lead error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'No ID' }, { status: 400 })

    if (USE_MOCK) {
      const lead = MOCK_LEADS.find((l) => l.id === id)
      if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      Object.assign(lead, updates)
      return NextResponse.json({ success: true, lead })
    }

    const updated = await updateLeadStatus(id, updates)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, lead: updated })
  } catch (err) {
    console.error('PATCH lead error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
