'use client'

import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartContext } from './CartProvider'

type CartContentProps = {
  deliveryFee: number
}

export function CartContent({ deliveryFee }: CartContentProps) {
  const router = useRouter()
  const { items, total, itemCount, updateQuantity, removeItem } = useCartContext()

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShoppingBag size={64} style={{ color: 'var(--color-border)' }} />
        <div className="text-center">
          <p
            className="font-semibold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            Carrinho vazio
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Adicione produtos para continuar
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-full font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Ver cardápio
        </button>
      </div>
    )
  }
  

  return (
    <div className="py-6 flex flex-col gap-6">
      <h2
        className="text-2xl font-bold"
        style={{ color: 'var(--color-text)' }}
      >
        Carrinho
        <span
          className="text-base font-normal ml-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
      </h2>

      <div className="flex flex-col gap-3">
        {items.map(({ product, quantity, selectedOptions }) => (
          
          <div
            key={product.id}
            className="flex gap-3 p-3 rounded-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
            
          >



            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
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

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className="font-semibold text-sm leading-tight"
                  style={{ color: 'var(--color-text)' }}
                >
                  {product.name}
                  
                </p>
                

                <button
                  onClick={() => removeItem(product.id)}
                  className="flex-shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {/*aqui tem a logica para os itens de baixo  */}
<span style={{ color: 'var(--color-text-muted)' }}>
  {quantity}x {product.name}
</span>

{/* Adiciona isso logo abaixo */}
{selectedOptions && selectedOptions.length > 0 && (
  <div className="text-xs mt-0.5 flex flex-col gap-0.5" style={{ color: 'var(--color-text-muted)' }}>
    {Object.entries(
      selectedOptions.reduce((acc, option) => {
        if (!acc[option.group_name]) {
          acc[option.group_name] = []
        }
        acc[option.group_name].push(option.option_name)
        return acc
      }, {} as Record<string, string[]>)
    ).map(([groupName, options]) => (
      <span key={groupName}>
        <strong>{groupName}:</strong> {options.join(', ')}
      </span>
    ))}
  </div>
)}
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="font-bold text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {formatPrice(product.price * quantity)}
                </span>

                <div
                  className="flex items-center gap-3 rounded-full px-2 py-1"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    className="text-sm font-semibold w-4 text-center"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
          <span style={{ color: 'var(--color-text)' }}>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>
            Taxa de entrega
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            Calculada no pedido
          </span>
        </div>
        <div
          className="flex justify-between font-bold pt-3"
          style={{
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <span>Total</span>
          <span style={{ color: 'var(--color-primary)' }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Finalizar pedido
      </button>
      
    </div>
  )
}