import { Lead } from '@/types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function getLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetch error:', error)
      return []
    }

    return (data || []).map(row => ({
      ...row,
      createdAt: row.created_at,
      conversationSummary: row.conversation_summary || '',
      rawConversation: row.raw_conversation || '',
      messages: row.messages || [],
    })) as Lead[]
  } catch (err) {
    console.error('Error fetching leads:', err)
    return []
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  try {
    const { error } = await supabase.from('leads').insert({
      id: lead.id,
      created_at: lead.createdAt,
      status: lead.status,
      score: lead.score,
      name: lead.name,
      company: lead.company,
      role: lead.role,
      email: lead.email,
      company_size: lead.companySize,
      current_tool: lead.currentTool,
      pain_point: lead.painPoint,
      timeline: lead.timeline,
      intent: lead.intent,
      conversation_summary: lead.conversationSummary,
      messages: lead.messages,
      raw_conversation: lead.rawConversation,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
  } catch (err) {
    console.error('Error saving lead:', err)
    throw err
  }
}

export async function updateLeadStatus(
  id: string,
  updates: Partial<Lead>
): Promise<Lead | null> {
  try {
    const updateData: Record<string, any> = {}

    if (updates.status) updateData.status = updates.status
    if (updates.score) updateData.score = updates.score
    if (updates.conversationSummary)
      updateData.conversation_summary = updates.conversationSummary

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return null
    }

    if (!data) return null

    return {
      ...data,
      createdAt: data.created_at,
      conversationSummary: data.conversation_summary || '',
      rawConversation: data.raw_conversation || '',
      messages: data.messages || [],
    } as Lead
  } catch (err) {
    console.error('Error updating lead:', err)
    return null
  }
}
