# NextReach — Web Chatbot İletişim Sistemi

Landing page'e gömülebilir bir chatbot, lead toplama ve yönetim sistemi. Ziyaretçileri doğal konuşmayla tanıyıp satış ekibinin harekete geçebileceği kaliteli talepler oluşturuyor.

**Live Demo:** [Vercel linki buraya eklenecek]  

---

## LOCAL'de Çalıştırma

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

