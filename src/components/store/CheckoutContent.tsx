'use client'

import { useStoreOpen } from '@/components/store/StoreStatusBadge'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartContext } from '@/components/store/CartProvider'
import { createOrder } from '@/lib/actions/orders'
import { MapPin, Store, User, Phone, MapPinned, Loader2 } from 'lucide-react'


type CheckoutContentProps = {
  openingTime: string
  closingTime: string
  workingDays: string
}


export function CheckoutContent({ openingTime, closingTime, workingDays }: CheckoutContentProps) {
  const isOpen = useStoreOpen(openingTime, closingTime, workingDays)

  const router = useRouter()
  const { items, total, clearCart } = useCartContext()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<'delivery' | 'pickup'>('pickup')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


useEffect(() => {
  if (items.length === 0) {
    router.push('/')
  }
}, [items.length])

if (items.length === 0) return null

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

async function handleSubmit() {
  setError(null)
  setLoading(true)

  const result = await createOrder({
    customer_name: name,
    phone,
    type,
    address: type === 'delivery' ? address : null,
items: items.map(item => ({
  product_id: item.product.id,
  quantity: item.quantity,
  options: item.selectedOptions.map(opt => ({
    option_name: opt.option_name,
    option_price: opt.option_price,
  
    })),
  }))
  })

  if (result?.error) {
    setError(result.error)
    setLoading(false)
    return
  }

  if (result?.code) {
    localStorage.setItem('last_order_code', result.code)
    clearCart()
    router.push(`/order/${result.code}`)
  }
}
  return (
    <div className="py-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Finalizar pedido
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Tipo de entrega
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'pickup', label: 'Retirar no local', icon: Store },
              { value: 'delivery', label: 'Entrega', icon: MapPin },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setType(value as 'delivery' | 'pickup')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold text-sm transition-all"
                style={{
                  backgroundColor: type === value ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: type === value ? 'white' : 'var(--color-text-muted)',
                  border: `1px solid ${type === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                <Icon size={24} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            <User size={14} className="inline mr-1" />
            Nome
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            <Phone size={14} className="inline mr-1" />
            Telefone
          </label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(82) 99999-9999"
            type="tel"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {type === 'delivery' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              <MapPinned size={14} className="inline mr-1" />
              Endereço
            </label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Rua, número, bairro"
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-center py-2 px-4 rounded-xl"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            {error}
          </p>
        )}

        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Resumo
          </p>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-muted)' }}>
                {quantity}x {product.name}
              </span>
              <span style={{ color: 'var(--color-text)' }}>
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          ))}
          <div
            className="flex justify-between font-bold pt-2"
            style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            <span>Subtotal</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
          </div>
        </div>

{!isOpen && (
  <div
    className="text-center py-3 px-4 rounded-xl text-sm font-semibold"
    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
  >
    🔒 Loja fechada no momento — pedidos bloqueados
  </div>
)}

<button
  onClick={handleSubmit}
  disabled={loading || !isOpen}
  className="w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2"
  style={{
    backgroundColor: 'var(--color-primary)',
    opacity: loading || !isOpen ? 0.5 : 1,
  }}
>
  {loading ? (
    <>
      <Loader2 size={20} className="animate-spin" />
      Criando pedido...
    </>
  ) : (
    'Confirmar pedido'
  )}
</button>
      </div>
    </div>
  )
}