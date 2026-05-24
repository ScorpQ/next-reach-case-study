# NextReach — Web Chatbot İletişim Sistemi

Landing page'e gömülebilir bir chatbot, lead toplama ve yönetim sistemi. Ziyaretçileri doğal konuşmayla tanıyıp satış ekibinin harekete geçebileceği kaliteli talepler oluşturuyor.

**Live Demo:** [Vercel linki buraya eklenecek]  
**GitHub:** https://github.com/ScorpQ/next-reach-case-study

---

## Lokalde Çalıştırma

### Gereklilikler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# Repo'yu klonla
git clone https://github.com/ScorpQ/next-reach-case-study.git
cd next-reach-case-study

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur (Groq API key gerekli)
# GROQ_API_KEY=gsk_xxxxx
# USE_MOCK_DATA=false (demo için true yapabilirsin)

# Dev server'ı başlat
npm run dev
```

Uygulama açılacak: `http://localhost:3000`

- **Landing page:** Ana sayfa, chatbot trigger butonu sağ altta
- **Chatbot:** "Bize Ulaşın" butonuyla açılıyor
- **Admin Panel:** `http://localhost:3000/admin` — tüm lead'leri görüyor

### Mock Data Modu
`.env`'de `USE_MOCK_DATA=true` yaparsanız API çağrısı yapmaz, örnek lead'ler gösterir. Testler ve sunumlar için.

---

## Teknoloji Seçimleri ve Nedenler

### Frontend & Framework
- **Next.js 16** — SSR/SSG, API routes, TypeScript desteği. B2B SaaS için production-ready.
- **React 19** — UI bileşenleri, state management.
- **TypeScript** — Type safety, IDE desteği, refactoring rahatlığı.
- **Tailwind CSS 4** — Rapid styling, dark mode ready, responsive design.

### AI & LLM
- **Groq LLaMA 3.3 70B** — Hızlı inference (ChatGPT'den 10x daha hızlı), ücretsiz tier. Streaming API desteği.
  - Alternatif: Claude (daha iyi konuşma, ama yavaş). ChatGPT (pahalı).
  - **Seçim nedeni:** Latency kritik — ziyaretçi cevap beklerken uygulama donup kalmamalı. Groq milliseconds'te yanıt verir.

### Data Storage
- **Dosya sistemi (JSON)** — Basit, deployment'ı zorunlu kılmıyor. Production'da PostgreSQL gibi veritabanı olurdu.
  - Seçim nedeni: 6 saatlik sprint, herhangi bir DB setup'u istememiş. Portable, git-friendly.

### UI Components
- **Lucide React** — 400+ icon, açık kaynak, hafif.
- **Custom UI lib (components/ui/)** — Shadcn pattern, TypeScript, accessible.

---

## Mimarı

```
app/
├── page.tsx              # Landing page
├── layout.tsx            # HTML metadata, global styles
├── api/
│   ├── chat/route.ts     # LLM endpoint (Groq)
│   └── leads/route.ts    # CRUD lead'ler
└── admin/
    └── page.tsx          # Admin panel

components/
├── chatbot.tsx           # Chat UI (modal, trigger button)
└── ui/
    └── button.tsx        # Reusable button

lib/
├── scoring.ts            # Lead scoring logic (hot/warm/cold)
├── storage.ts            # JSON file R/W
├── mock-data.ts          # Demo lead'ler
└── utils.ts              # cn() util

types/
└── index.ts              # Lead, Message interfaces
```

---

## Kararlar: PRD'deki Muğlak Kısımlar

### 1. Chatbot Sorular & Akış

**Sorular (doğal sırada):**
1. Sıcak karşılama — ne aradıklarını anla
2. İsim, şirket, rol
3. Mevcut durumları (hangi araçlar, ne eksik)
4. Ana sorun/ihtiyaç (pain point)
5. Zaman çerçevesi (karar ne zaman verecek)
6. Email

**Ne zaman bitir:**
- 10 mesaj alışverişi sonrası
- Email alındıktan sonra
- Konuşmaya gerek yok hissedilince

**Kod:** [/app/api/chat/route.ts](/app/api/chat/route.ts) — sistem prompt'ta tanımlı.

### 2. Chatbot Tonu & Kişiliği

- **Samimi ve profesyonel** — kurumsal değil, kişileştirilmiş
- **Meraklı ama baskıcı değil** — sorular, ama zorlamama
- **Bir anda tek soru** — cognitive overload yok
- **Kısa mesajlar** — 2-3 cümle max

**Niçin:** Conversion rate düştü çünkü ziyaretçiler "form çok soğuk" diyor. Sıcak, doğal sohbet daha rahat.

### 3. Lead Scoring — Satış Ekibi İyi/Kötü Ayırması

**Puanlama sistemi:**
```
Email: +3 puan
Şirket adı: +2 puan
Pain point (15+ karakter): +2 puan
Timeline:
  - Hemen/Acil/Bu ay: +3
  - Çeyrek/3 ay: +2
  - Vague: +1
Şirket büyüklüğü:
  - 500+ / Enterprise: +3
  - 100-500 / Orta: +2
  - <100: +1
Rol:
  - C-level / Direktör: +2
  - Diğer: +1

10+ puan = 🔥 Sıcak
5-9 puan = 🌡️ Ilık
<5 puan = ❄️ Soğuk
```

**Niçin:** Satış ekibi "kim neden ulaşmış" sorusu soruyor. Score = Priority ranking.

**Kod:** [/lib/scoring.ts](/lib/scoring.ts)

### 4. Admin View — Ekibin Hayatını Kolaylaştırmak

**Gösterilen bilgiler:**

| Kolon | Açıklama |
|-------|----------|
| Score | Hot/Warm/Cold badge |
| İsim + Şirket + Rol | Kimin ulaştığı |
| Email | İletişim |
| Intent | Ne istiyor (demo/fiyat/bilgi) |
| Status | Yeni/İletişim geçildi/Nitelikli/Uygun değil |
| Zaman | Kaç dakika/saat önce |

**Detay (expand):**
- Konuşmanın özeti (Türkçe, satış ekibi anlasın)
- Pain point (kırmızı çizgi ile highlight)
- Full konuşma transkripti
- Şirket büyüklüğü, mevcut araç, timeline, niyet

**Niçin:** Satış teamı gün içinde açıp "bugün hangi talepler gelmiş" görebilmeli — scroll, filter, expand, özet oku, konuşmaya bak.

**Kod:** [/app/admin/page.tsx](/app/admin/page.tsx)

### 5. Spam & Kötü Niyetli Kullanım

**Koruma mekanizmaları:**

| Tehdit | Çözüm |
|--------|-------|
| Anlamsız input | "Sizi daha iyi anlayabilmek için biraz daha bilgi verebilir misiniz?" (sistem prompt) |
| Boş talep (skor <5) | Score gösteriliyor — satış ekibi "soğuk lead" yok saydığını yapabilir |
| Bot trafiği / API abuse | Rate limiting (production'da). Şu an dev. |
| Spam mesajlar | LLM filtreliyor (sistem prompt'ta talimat var) |

**Niçin:** Satış ekibi "eksik/alakasız lead" şikayeti veriyor. Filtreleme LLM'ye, scoring data-driven.

**Production'da eklenmesi gerekenler:**
- Rate limiting (IP başına 5 talep/saat)
- Email validation
- CAPTCHA (chatbot başında)

### 6. Ziyaretçi Soruya Cevap Vermezse

- Zorlanmaz, devam edilir
- "Tamam, başka bir soru..." şekilde geçilir
- Eğer email alındıysa → konuşma kapatılır

**Niçin:** Lead, tam bilgi olmasa bile değerli olabilir. Satış ekibi 80% info ile 20% info'den daha iyi.

**Kod:** Sistem prompt'ta "Birisi soru atlamak isterse zorlamadan devam et."

---

## 6 Saatte Ne Yapılabildi

✅ Chatbot UI (modal, trigger button, message rendering)  
✅ LLM integrasyonu (Groq API, system prompt with lead extraction)  
✅ Lead extraction (HTML comment → JSON parsing)  
✅ Lead scoring (hot/warm/cold)  
✅ Admin panel (table, filter, expand details, status dropdown)  
✅ Storage (JSON file, CRUD)  
✅ TypeScript types & UI components  
✅ Responsive design (mobile-first)  

---

## 6 Saatin Sonrası: Yapılması Gerekenler

### Priority 1 (Production-ready olmak için)
- [ ] **Database** (PostgreSQL/MongoDB) — dosya sistemi güvenli değil, scalable değil
- [ ] **Authentication** — admin panel korunsun
- [ ] **Rate limiting** — spam'den korunma
- [ ] **Email validation** — fake email'ler filtrelenmeli
- [ ] **Error handling** — API failures, timeout'lar
- [ ] **Analytics** — lead conversion funneli (Posthog/Segment)

### Priority 2 (UX)
- [ ] **Typing indicator** — "NextReach yazıyor..." animasyonu
- [ ] **Message reactions** — 👍/👎 lead kalitesi feedback'i
- [ ] **Conversation persistence** — refresh'te mesajlar kaybolmasın (localStorage)
- [ ] **Mobile optimization** — chatbot iPad'de test edilmedi
- [ ] **Dark mode** — admin panel dark theme

### Priority 3 (Business)
- [ ] **Email integration** — lead'ler Slack/Gmail'e gitse
- [ ] **Leadler dashboard** — conversion funnel, daily stats
- [ ] **A/B testing** — chatbot tono/sorularını test etme
- [ ] **Ziyaretçi segmentasyon** — yeni vs returning, traffic source
- [ ] **Export** — CSV/Excel lead çıktısı

---

## Environment Variables

```env
# .env dosyasında gerekli:

GROQ_API_KEY=gsk_xxxxxxxxxxxxx  # https://console.groq.com/keys
USE_MOCK_DATA=false             # Demo için true (gerçek API istemez)
```

---

## API Endpoints

### POST /api/chat
Mesaj gönder, LLM'den yanıt al.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Merhaba" },
    { "role": "assistant", "content": "Merhaba! ..." }
  ]
}
```

**Response:**
```json
{
  "content": "Yanıt mesajı",
  "leadData": {
    "name": "Ayşe",
    "email": "ayse@company.com",
    "company": "ModaStore",
    "role": "CEO",
    ...
  }
}
```

### GET /api/leads
Tüm lead'leri getir (admin panel).

**Response:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "createdAt": "2026-05-24T...",
      "status": "new",
      "score": "hot",
      "name": "Ayşe",
      ...
    }
  ]
}
```

### PATCH /api/leads
Lead'in status'ünü güncelle.

**Request:**
```json
{
  "id": "uuid",
  "status": "qualified"
}
```

---

## Testing

```bash
# Dev server çalış
npm run dev

# Chatbot test et:
# 1. http://localhost:3000 açık
# 2. "Bize Ulaşın" butonuna tıkla
# 3. Sohbeti başlat
# 4. Admin panel'i kontrol et: http://localhost:3000/admin

# Build kontrol
npm run build

# Linting
npm run lint
```

---

## Deployment (Vercel)

```bash
# GitHub'a push et (zaten yapıldı)
git push origin main

# Vercel'de:
# 1. vercel.com'da repo'yu bağla
# 2. Environment variables ekle (GROQ_API_KEY)
# 3. Deploy butonuna tıkla

# Vercel otomatik Next.js'i build eder ve deploy eder
```

---

## Stack Özeti

| Katman | Teknoloji | Niçin |
|--------|-----------|-------|
| Frontend | Next.js, React 19, TypeScript, Tailwind | Production-ready, type-safe, fast |
| Backend | Next.js API Routes | Serverless, simple, FaaS-friendly |
| LLM | Groq LLaMA 3.3 70B | Hızlı inference (ms latency) |
| Database | JSON (dev), PostgreSQL (prod) | Portable, git-friendly (dev) |
| UI | Lucide icons, custom components | Accessible, lightweight |
| Hosting | Vercel | Next.js-native, automatic deployments |

---

## Lisans

Bu proje staj teslim görevine aittir. İçerik NextReach şirketi tarafından tasarlanmıştır.

---

## Sorular?

Koda bak:
- Chatbot logic: [/components/chatbot.tsx](/components/chatbot.tsx)
- LLM integration: [/app/api/chat/route.ts](/app/api/chat/route.ts)
- Lead scoring: [/lib/scoring.ts](/lib/scoring.ts)
- Admin panel: [/app/admin/page.tsx](/app/admin/page.tsx)

---

**⏱️ Toplam Çalışma Süresi:** 5.5 saat  
**📅 Teslim Tarihi:** 24 Mayıs 2026  
**✅ Status:** Ready for review

## PRD'de muğlak bırakılan kararlar ve yorumlarım

**Chatbot ne soracak, hangi sırayla?**
Sabit sıra yerine Claude'a akışı verdim ama "robot gibi sırayla sorma" dedim. Konuşmanın gidişatına göre adapte oluyor. Tek kural: bir anda tek soru.

**Ne zaman "yeter" diyecek?**
Email alındığında VEYA 10 mesaj alışverişinden sonra. Email olmasa da isim + şirket + pain point varsa lead kaydediyoruz — eksik bilgi var ama satış ekibi takip edebilir.

**Chatbot'un tonu?**
Samimi ve kısa. "Kurumsal chatbot" havasından kaçtım. Ziyaretçi anketi dolduruyormuş gibi hissettirmemek için sohbet akışı bıraktım.

**İyi lead / kötü lead ayrımı?**
Puanlama sistemi (`lib/scoring.ts`): email (+3), şirket (+2), pain point (+2), zaman çerçevesi aciliyeti (+1-3), şirket büyüklüğü (+1-3), karar verici rol (+1-2). 10+ puan = sıcak, 5-9 = ılık, <5 = soğuk. Admin'de filtre ve renk kodlaması ile görsel ayrım.

**Admin view nasıl olmalı?**
Satış ekibinin sabah açıp "bugün ne var" diyebileceği format: skor rengi, özet, genişletilebilir detay, durum dropdown'ı (yeni → iletişime geçildi → nitelikli/uygun değil).

**Kötü niyetli kullanım?**
Şu an: spam/anlamsız input gelirse Claude kibarca tekrar soruyor. Eksik olan: rate limiting (IP başına dakikada X istek), honeypot field, Cloudflare Turnstile entegrasyonu.

**Ziyaretçi soruyu atlarsa?**
Claude'a "zorlamadan devam et" dedim. "Şirket adını paylaşmak istemiyorum" derse "Tabii, anlıyorum" deyip bir sonraki konuya geçiyor. Hiçbir alan zorunlu değil — lead eksik bilgiyle de kaydediliyor.

---

## Toplam süre
~5.5 saat
