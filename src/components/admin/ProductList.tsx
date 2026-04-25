'use client'

import { SlidersHorizontal } from 'lucide-react'
import { ProductOptionsModal } from './ProductOptionsModal'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Product, Category } from '@/types'
import { deleteProduct } from '@/lib/actions/admin'
import { ProductForm } from './ProductForm'

type ProductListProps = {
  products: Product[]
  categories: Category[]
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

export function ProductList({ products, categories }: ProductListProps) {
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [managingOptions, setManagingOptions] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    await deleteProduct(id)
    setDeleting(null)
  }

  if (products.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Nenhum produto cadastrado ainda.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      
      {products.map(product => (
        <div key={product.id}>
          {editing === product.id ? (
            <ProductForm
              product={product}
              categories={categories}
              onClose={() => setEditing(null)}
            />
          ) : (
            <div
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  '🍦'
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm"
                  style={{ color: 'var(--color-text)' }}
                >
                  {product.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {formatPrice(product.price)} ·{' '}
                  {product.available ? (
                    <span style={{ color: '#10B981' }}>Disponível</span>
                  ) : (
                    <span style={{ color: '#EF4444' }}>Indisponível</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(product.id)}
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <Pencil size={16} />
                </button>
                {/*aqui estou colocando os adicionais */}
                <button
                    onClick={() => setManagingOptions(product.id)}
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <SlidersHorizontal size={16} />
                  </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  style={{ color: '#EF4444', opacity: deleting === product.id ? 0.5 : 1 }}
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>
          )}
        </div>
      ))}
      {managingOptions && (
  <ProductOptionsModal
    product={products.find(p => p.id === managingOptions)!}
    onClose={() => setManagingOptions(null)}
  />
)}
    </div>
    
  )
  
}