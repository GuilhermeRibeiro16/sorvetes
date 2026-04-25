'use client'

import { usePathname, useRouter } from 'next/navigation'
import { History, Home, Search, ShoppingCart, User } from 'lucide-react'
import { useCartContext } from './CartProvider'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCartContext()

  const items = [
    { icon: Home, label: 'Início', href: '/' },

    { icon: ShoppingCart, label: 'Carrinho', href: '/cart' },
    { icon: History, label: 'Histórico', href: '/profile' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around py-3">
        {items.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          const isCart = href === '/cart'

          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-1 relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  style={{
                    color: isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-text-muted)',
                  }}
                />
                {isCart && itemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span
                className="text-xs"
                style={{
                  color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}