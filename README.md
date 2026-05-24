# NextReach — Web Chatbot İletişim Sistemi

Landing page'e gömülebilir bir chatbot, lead toplama ve yönetim sistemi. Ziyaretçileri doğal konuşmayla tanıyıp satış ekibinin harekete geçebileceği kaliteli talepler oluşturuyor.

**Live:** https://next-reach-case-study-qz2u4n1ku-cansins-projects-9a5fef1c.vercel.app/

---

## LOCAL'de Çalıştırma

### Gereklilikler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
git clone https://github.com/ScorpQ/next-reach-case-study.git
cd next-reach-case-study

# Dependecyler yüklenir
npm install

# .env dosyasını doldurulmalı, örnek env mevcut.

# server run kodu
npm run dev
```

Uygulama açılacak: `http://localhost:3000`

- **Landing page:** Ana sayfa, chatbot trigger butonu sağ altta
- **Chatbot:** "Bize Ulaşın" butonuyla açılıyor
- **Admin Panel:** `http://localhost:3000/admin` — tüm lead'leri görüyor



## Hangi teknolojileri seçtim

Hızlı bir deployment gerçekleştirmek için frontend ve backend yapısını bir arada kurmak istedim.
Bu sebep ile **Next.js** kullandım. 

Normalde ise frontend tarafında react, backend tarafında Java Spring Boot ile NestJS arasında seçim yapardım.

**Vercel** kullanarak deploy ettim. Veri tabanımı ise **docker** kullanarak ayağa kaldırmak yerine hızlı bir şekilde deploy edebilmek için **Supabase** kullandım.


## 6 saatte neyi yapamadın, daha fazla zamanda ne eklerdin?

ilk işim kesinlikle keycloak ile bir authorization sistemi kurmak olurdu. Bir benzerini önceden geliştirdiğim bir mikroservis uygulamasında yapmıştım (https://github.com/ScorpQ/ecommerce-microservices-java).

Daha sonra daha sağlıklı bir deployment için docker-compose dosyaları hazırlardım ve sunucumda docker ile deploy ederdim.


## Zaman

Projeyi yaklaşık **6-7 saat** içerisinde tamamladım. Daha fazla vaktim olsaydı code-base'i daha temiz tutmaya çalışırdım, kesinlikle gözümden kaçan kötü kodlar vardır şu anda.


## PRD’de muğlak bıraktığımız yerleri nasıl yorumladın

- Chatbot ziyaretçiye ne soracak? Hangi sırayla? Ne zaman “yeter” diyecek? || Chatbot’un tonu ve kişiliği nasıl olmalı? NextReach’i nasıl temsil ediyor?

    Öncelikle chatbot olarak Groq kullandım,
    soracağı soruları ve kişiliğini "app > api > chat > route.ts" dosyasında belirttim. Detaylı bir şekilde incelenebilir. 


- Satış ekibi “iyi bir lead”i kötüsünden nasıl ayırt edecek?

    Lead'ler tarafından verilen bilgiler bir score sistemi içerisinde ölçülür. Lead tarafından ne kadar bilgi alınabilirse iyi veya kötülük ölçümü o kadar düzgün ve keskin yapılır. "lib > scoring." altında incelenebilir.

- Admin view’de hangi bilgiyi nasıl gösterirsen ekibin hayatını kolaylaştırırsın?

    Açıkçası buna çok somut bir cevabım yok. Konuşa içerisine gerçekleştirilen önemli bilgilerin özetini ve verilen bilgileri göstermeye çalıştım. Bu kesinlikle beyin fırtınası gerektiren bir özellik. Bunu satış ekibiyle konuşmam lazım.


- Kötü niyetli kullanım (spam, boş talepler, bot trafiği) için ne yaparsın?

    Bu konuda daha önce derin çalışmalarım olmadığı için boş talepleri veya bot trafiği gibi durumları handle **edemedim**.

- Ziyaretçi bir sorunun cevabını vermek istemezse ne olur?

    Eğer kullanıcı "şirketi söylemek istemiyorum" derse bile chatbot "Tabii, anlıyorum" diyerek devam ediyor. Hiçbir alan zorunlu değil — eksik bilgiyle de lead kaydediliyor, satış ekibi görür ne kadar dolu geldiğini.


## Son olarak

Ben yakın zamanda çok daha kapsamlı bir e-ticaret sitesi oluşturmuştum. Lütfen bu projemi de incelemeyi unutmayın: 
    https://github.com/ScorpQ/ecommerce-microservices-java
