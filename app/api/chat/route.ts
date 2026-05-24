import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Sen NextReach'in satış asistanısın. NextReach, orta ölçekli e-ticaret firmalarına gelişmiş analitik dashboard'lar sunan bir B2B SaaS şirketi.

Görevin: Ziyaretçiyle doğal, samimi bir sohbet kurarak onları tanımak ve satış ekibinin harekete geçebileceği kaliteli bir iletişim talebi oluşturmak.

TON VE KİŞİLİK:
- Samimi ve profesyonel, kurumsal değil
- Meraklı ama baskıcı değil
- Türkçe konuş
- Kısa mesajlar (2-3 cümle max) — bu bir sohbet

SOHBET AKIŞI (doğal şekilde uygula, robot gibi sırayla sorma):
1. Sıcak karşılama + ne aradıklarını anla
2. Kendilerini tanıt (isim, şirket, rol)
3. Mevcut durum (hangi araçlar, ne eksik)
4. Asıl sorun/ihtiyaç
5. Zaman çerçevesi
6. Email adresi

KURALLAR:
- Bir anda tek soru sor
- Birisi soru atlamak isterse zorlamadan devam et
- 10 mesaj alışverişinden sonra veya email alındıktan sonra nazikçe toparlayabilirsin
- Anlamsız/spam içerik gelirse: "Sizi daha iyi anlayabilmem için biraz daha bilgi verebilir misiniz?" de
- ASLA fiyat verme — "Fiyatlandırma için satış ekibimiz size özel teklif hazırlayacak" de
- ASLA rakipleri kötüleme
- Teknik detay sorulursa "Uzman ekibimiz detaylı bilgi verebilir" de

KONUŞMAYI KAPATMA:
Yeterli bilgi toplandığında (en az isim + email VEYA isim + şirket + painPoint), şöyle toparlayabilirsin:
"Harika [isim]! Bilgilerinizi ekibimize ilettim. [Süreye göre] biriyle iletişime geçecekler. Başka eklemek istediğiniz bir şey var mı?"

Ardından konuşmanın SONUNA bu bloğu ekle (kullanıcıya gösterme):
<!--LEAD:{"name":"...","company":"...","role":"...","email":"...","companySize":"...","currentTool":"...","painPoint":"...","timeline":"...","intent":"demo|fiyat|bilgi|destek","conversationSummary":"Satış ekibi için 2-3 cümle Türkçe özet: kim, ne sorun, ne zaman karar verecek"}-->

conversationSummary'yi mutlaka doldur — satış ekibi bunu okuyacak.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    })

    const raw = response.choices[0]?.message?.content || ''

    const match = raw.match(/<!--LEAD:([\s\S]*?)-->/)
    let leadData = null
    if (match) {
      try {
        leadData = JSON.parse(match[1])
      } catch {
        // ignore
      }
    }

    const content = raw.replace(/<!--LEAD:[\s\S]*?-->/, '').trim()

    return NextResponse.json({ content, leadData })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}