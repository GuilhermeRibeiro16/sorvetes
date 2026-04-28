import { CartProvider } from '@/components/store/CartProvider'
import { BottomNav } from '@/components/store/BottomNav'
import { StoreStatusBadge } from '@/components/store/StoreStatusBadge'
import { createClient } from '@/lib/supabase/server'
import Footer from '@/components/layout/Footer'
import { Hamburger } from 'lucide-react'



async function getStoreSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*')
  const getValue = (key: string) => data?.find(s => s.key === key)?.value || ''
  return {
    openingTime: getValue('opening_time'),
    closingTime: getValue('closing_time'),
    workingDays: getValue('working_days'),
  }
}


export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getStoreSettings()

  return (
    <CartProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
          className="sticky top-0 z-50 px-4 py-3"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                      <div className="flex items-center space-x-2 mb-6">
                            <div className="relative">
                            <Hamburger className="w-8 h-8 text-pink-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-bold bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                Burgueria
                            </h3>
                        </div>
            </h1>
            <StoreStatusBadge
              openingTime={settings.openingTime}
              closingTime={settings.closingTime}
              workingDays={settings.workingDays}
            />
          </div>
        </header>

        <main className="max-w-4xl min-h-screen mx-auto px-4 pb-24">
          {children}
        </main>

        <Footer />

        <BottomNav />
      </div>
    </CartProvider>
  )
}