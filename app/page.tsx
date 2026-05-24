import { Chatbot } from '@/components/chatbot'
import { BarChart3, Zap, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(222.2,47.4%,11.2%)]">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">NextReach</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Özellikler</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Fiyatlandırma</a>
            <a href="#about" className="transition-colors hover:text-foreground">Hakkımızda</a>
          </nav>
          <a href="/admin" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Admin →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-[hsl(210,40%,96.1%)] px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          E-ticaret analitiklerinde #1 tercih
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Verilerinizi{' '}
          <span className="text-[hsl(186,34%,28%)]">aksiyona</span>{' '}
          dönüştürün
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Orta ölçekli e-ticaret firmaları için tasarlanmış analitik dashboard. Satış, dönüşüm ve müşteri verilerini tek platformda görün.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="inline-flex h-11 items-center gap-2 rounded-md bg-[hsl(222.2,47.4%,11.2%)] px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800">
            Ücretsiz deneyin
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="inline-flex h-11 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors hover:bg-muted">
            Demo izle
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-[hsl(210,40%,96.1%)]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '2.400+', label: 'Aktif müşteri' },
              { value: '%34', label: 'Ortalama gelir artışı' },
              { value: '99.9%', label: 'Uptime garantisi' },
              { value: '<2dk', label: 'Kurulum süresi' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          İhtiyacınız olan her şey, tek platformda
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: 'Gerçek zamanlı analitik', desc: 'Satış, trafik ve dönüşüm verilerini canlı olarak takip edin. Gecikme yok, tahmin yok.' },
            { icon: Zap, title: 'Akıllı raporlama', desc: 'Haftalık ve aylık raporlar otomatik oluşturulur. Siz sadece kararları verin.' },
            { icon: Shield, title: 'KVKK uyumlu', desc: "Tüm verileriniz Türkiye'deki sunucularda, tam KVKK uyumluluğuyla saklanır." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(222.2,47.4%,11.2%)]">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[hsl(210,40%,96.1%)] py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Şeffaf fiyatlandırma</h2>
          <p className="mt-4 text-muted-foreground">Şirketinizin büyüklüğüne göre özel fiyatlandırma için satış ekibimizle konuşun.</p>
          <div className="mt-8 inline-flex flex-col items-start gap-3 rounded-xl border bg-white p-8 text-left shadow-sm">
            {['Sınırsız dashboard', '5 kullanıcıya kadar', '12 aylık veri geçmişi', 'E-posta desteği', 'KVKK sözleşmesi'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-[hsl(186,34%,28%)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[hsl(222.2,47.4%,11.2%)]">
              <BarChart3 className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">NextReach</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 NextReach. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  )
}
