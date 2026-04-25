import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, ShoppingBag, Package, Settings, BarChart, BarChart2 } from 'lucide-react'
import Link from 'next/link'



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            🍦 Admin   
          </h1>
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/admin/login')
          }}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex">
        <nav
          className="w-48 min-h-screen p-4 flex flex-col gap-1 sticky top-14 self-start"
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          {[
            { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart2 },
            { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
            { href: '/admin/products', label: 'Produtos', icon: Package },
            { href: '/admin/settings', label: 'Configurações', icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}