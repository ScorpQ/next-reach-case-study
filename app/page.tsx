import { Chatbot } from '@/components/chatbot'
import { BarChart3, ArrowRight } from 'lucide-react'

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
          <a  href="/admin"
  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
>
  Admin Panel →
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
