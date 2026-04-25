'use client'

import { useState } from 'react'
import { Phone, Search, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getOrdersByPhone } from '@/lib/actions/orders'

const statusLabels: Record<string, string> = {
  received: 'Recebido',
  preparing: 'Em preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
}

const statusColors: Record<string, string> = {
  received: '#F59E0B',
  preparing: '#3B82F6',
  ready: '#10B981',
  delivered: '#6B7280',
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export default function ProfilePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!phone.trim()) return
    setLoading(true)
    setSearched(true)

    const result = await getOrdersByPhone(phone.trim())
    setOrders(result)
    setLoading(false)
  }

  return (
    <div className="py-6 flex flex-col gap-6 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Meus pedidos
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Digite seu telefone para ver o histórico
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Phone size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="(82) 99999-9999"
            type="tel"
            className="flex-1 outline-none text-sm"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-3 rounded-xl text-white font-semibold"
          style={{
            backgroundColor: 'var(--color-primary)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Search size={18} />
        </button>
      </div>


      {loading && (
        <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          Buscando pedidos...
        </p>
      )}

      {!loading && searched && orders?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🍦</p>
          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
            Nenhum pedido encontrado
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Verifique o número digitado
          </p>
        </div>
      )}

      {!loading && orders && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => router.push(`/order/${order.code}`)}
              className="flex items-center gap-3 p-4 rounded-2xl text-left w-full"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                    #{order.code}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {formatDate(order.created_at)} · {formatPrice(order.total)}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            </button>
            
            
          ))}
        </div>
        
      )}
      
    </div>
  )
}