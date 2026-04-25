'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Product } from '@/types'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false)

  function handleAdd() {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        className="w-full h-40 flex items-center justify-center text-6xl"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          '🍦'
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3
            className="font-semibold text-sm leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p
              className="text-xs mt-1 line-clamp-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span
            className="font-bold text-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </span>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
            style={{
              backgroundColor: added
                ? 'var(--color-accent)'
                : 'var(--color-primary)',
            }}
          >
            {added ? (
              <>
                <Check size={14} />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}