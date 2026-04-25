'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order, OrderStatus } from '@/types'
import { Package, CheckCircle, Clock, Bike, Store, MapPin, X } from 'lucide-react'

const statusConfig: Record<OrderStatus, { label: string; icon: any; step: number }> = {
  received: { label: 'Pedido recebido', icon: Clock, step: 1 },
  preparing: { label: 'Em preparo', icon: Package, step: 2 },
  ready: { label: 'Pronto', icon: CheckCircle, step: 3 },
  delivered: { label: 'Entregue', icon: Bike, step: 4 },
  cancelled: { label: 'Cancelado', icon: X, step: 0 },
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

export function OrderTracker({ initialOrder }: { initialOrder: any }) {
  const [order, setOrder] = useState<any>(initialOrder)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        payload => {
          setOrder((prev: any) => ({ ...prev, ...payload.new }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order.id])

  const currentStep = statusConfig[order.status as OrderStatus].step

  return (
    <div className="py-6 flex flex-col gap-6">
      <div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Pedido
        </p>
        <h2 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
          #{order.code}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Olá, {order.customer_name}
        </p>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Status do pedido
        </p>

        <div className="flex flex-col gap-3">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon
            const isCompleted = config.step <= currentStep
            const isCurrent = config.step === currentStep

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isCompleted
                      ? 'var(--color-primary)'
                      : 'var(--color-background)',
                    border: `2px solid ${isCompleted
                      ? 'var(--color-primary)'
                      : 'var(--color-border)'}`,
                  }}
                >
                  <Icon size={16} color={isCompleted ? 'white' : 'var(--color-text-muted)'} />
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: isCurrent
                      ? 'var(--color-primary)'
                      : isCompleted
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                    fontWeight: isCurrent ? 700 : 400,
                  }}
                >
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="rounded-2xl p-4 flex flex-col gap-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {order.type === 'delivery' ? (
            <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
          ) : (
            <Store size={16} style={{ color: 'var(--color-primary)' }} />
          )}
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {order.type === 'delivery'
              ? `Entrega — ${order.address}`
              : 'Retirada no local'}
          </p>
        </div>

{order.order_items?.map((item: any) => (
  <div key={item.id} className="flex flex-col gap-0.5">
    <div className="flex justify-between text-sm">
      <span style={{ color: 'var(--color-text-muted)' }}>
        {item.quantity}x {item.product_name}
      </span>
      <span style={{ color: 'var(--color-text)' }}>
        {formatPrice(item.unit_price * item.quantity)}
      </span>
    </div>
    {item.order_item_options?.length > 0 && (
      <p className="text-xs pl-3" style={{ color: 'var(--color-text-muted)' }}>
        {item.order_item_options.map((o: any) => o.option_name).join(', ')}
      </p>
    )}
  </div>
))}

        <div
          className="flex justify-between font-bold pt-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span style={{ color: 'var(--color-text)' }}>Total</span>
          <span style={{ color: 'var(--color-primary)' }}>
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}