# NextReach — Web Chatbot İletişim Agent'ı

## Nasıl çalıştırılır (lokalde)

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env.local dosyasını oluştur
cp .env.example .env.local
# ANTHROPIC_API_KEY değerini ekle

# 3. Geliştirme sunucusunu başlat
npm run dev

# Uygulama: http://localhost:3000
# Admin:     http://localhost:3000/admin
```

### Mock data modu
`.env.local` içinde `USE_MOCK_DATA=true` ise chatbot Claude API'yi çağırmaz, admin view'de örnek lead'ler gösterir. Test için uygundur.

---

## Teknoloji seçimleri ve gerekçeleri

| Teknoloji | Neden? |
|-----------|--------|
| **Next.js 15 (App Router)** | Backend (API routes) ve frontend tek projede. Vercel'e deploy tek adım. |
| **TypeScript** | Type safety — Lead modeli, API response'ları hatalı kullanımı erkenden yakalar. |
| **Tailwind CSS** | Atelier referans projesinin stiline yakın, hızlı geliştirme. |
| **Anthropic SDK** | Chatbot zekası için. System prompt ile lead extraction yapılıyor. |
| **Dosya tabanlı storage** | Hızlı prototip için. Gerçek deploy'da Supabase/PostgreSQL'e geçilmeli (aşağıda neden açıklanıyor). |

### Neden dosya tabanlı storage? (ve neden Supabase geçilmeli)
Vercel'de API route'lar serverless — her istek farklı bir container'da çalışabilir, dosya sistemi kalıcı değil. Lokalde çalışır ama production'da lead'ler kaybolabilir. Gerçek deploy için `.data/leads.json` → Supabase `leads` tablosuna geçiş: `lib/storage.ts` içindeki fonksiyonları Supabase client ile değiştirmek yeterli (~30 satır).

---

## 6 saatte neyi yapamadım, daha fazla zamanda ne eklenirdi

- **Supabase entegrasyonu**: Dosya yerine gerçek veritabanı
- **Email bildirimi**: Yeni lead gelince satış ekibine Resend/Nodemailer ile mail
- **Gerçek zamanlı admin**: Server-Sent Events ile yeni lead gelince sayfa yenileme gerektirmez
- **Spam koruması**: Rate limiting (Upstash Redis), basit bot detection, honeypot field
- **Auth**: Admin view şu an korumasız — basit bir API key veya NextAuth yeterli olurdu
- **Lead arama/filtreleme**: Admin'de isim/email araması
- **Webhook**: CRM'e (HubSpot, Pipedrive) otomatik lead gönderimi

---

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
