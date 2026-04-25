'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, X } from 'lucide-react'

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

export function LastOrderBanner() {
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const code = localStorage.getItem('last_order_code')
    if (!code) return

    const supabase = createClient()

    supabase
      .from('orders')
      .select('code, status, customer_name')
      .eq('code', code)
      .single()
      .then(({ data }) => {
        if (data && data.status !== 'delivered') {
          setOrder(data)
        } else {
          localStorage.removeItem('last_order_code')
        }
      })
  }, [])

  if (!order) return null

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl mb-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-primary)',
      }}
    >
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
          Pedido em andamento
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
            #{order.code}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
            style={{ backgroundColor: statusColors[order.status] }}
          >
            {statusLabels[order.status]}
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push(`/order/${order.code}`)}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Ver pedido
        <ChevronRight size={14} />
      </button>

      <button
        onClick={() => {
          localStorage.removeItem('last_order_code')
          setOrder(null)
        }}
        style={{ color: 'var(--color-text-muted)' }}
      >
        <X size={16} />
      </button>
    </div>
  )
}