export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Lead {
  id: string
  createdAt: string
  status: 'new' | 'contacted' | 'qualified' | 'disqualified'
  score: 'hot' | 'warm' | 'cold'
  name?: string
  company?: string
  role?: string
  email?: string
  companySize?: string
  currentTool?: string
  painPoint?: string
  timeline?: string
  intent?: string
  conversationSummary: string
  messages: Array<{ role: string; content: string }>
  rawConversation: string
}
