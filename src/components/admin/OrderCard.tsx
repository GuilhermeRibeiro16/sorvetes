'use client'

import { Printer } from 'lucide-react'
import { OrderReceipt } from './OrderReceipt'
import { useState } from 'react'
import { MapPin, Store, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react'
import { Order, OrderStatus } from '@/types'
import { updateOrderStatus, cancelOrder, updateOrder } from '@/lib/actions/admin'

const statusLabels: Record<OrderStatus, string> = {
  received: 'Recebido',
  preparing: 'Em preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const statusColors: Record<OrderStatus, string> = {
  received: '#F59E0B',
  preparing: '#3B82F6',
  ready: '#10B981',
  delivered: '#6B7280',
  cancelled: '#EF4444',
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
}

const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
  received: 'Iniciar preparo',
  preparing: 'Marcar como pronto',
  ready: 'Confirmar entrega',
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

export function AdminOrderCard({ order }: { order: Order & { order_items: any[] } }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [type, setType] = useState<'delivery' | 'pickup'>(order.type as any)
  const [printing, setPrinting] = useState(false)

function handlePrint() {
  const receipt = document.getElementById('receipt')
  if (!receipt) return

  const printWindow = window.open('', '_blank', 'width=400,height=600')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>Comanda #${order.code}</title>
        <style>
          body { margin: 0; padding: 8px; font-family: monospace; }
          @media print { body { width: 302px; } }
        </style>
      </head>
      <body>${receipt.innerHTML}</body>
    </html>
  `)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}




  async function handleUpdateStatus() {
    const next = nextStatus[order.status as OrderStatus]
    if (!next) return
    setLoading(true)
    await updateOrderStatus(order.id, next)
    setLoading(false)
  }

  async function handleCancel() {
    setLoading(true)
    await cancelOrder(order.id)
    setLoading(false)
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('id', order.id)
    await updateOrder(formData)
    setEditing(false)
    setLoading(false)
  }

  const next = nextStatus[order.status as OrderStatus]
  const inputStyle = {
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                #{order.code}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                style={{ backgroundColor: statusColors[order.status as OrderStatus] }}
              >
                {statusLabels[order.status as OrderStatus]}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text)' }}>
              {order.customer_name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {order.phone}
            </p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>
              {formatPrice(order.total)}
            </p>
            <div className="flex items-center gap-1">
              {order.type === 'delivery' ? (
                <MapPin size={12} style={{ color: 'var(--color-text-muted)' }} />
              ) : (
                <Store size={12} style={{ color: 'var(--color-text-muted)' }} />
              )}
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {order.type === 'delivery' ? 'Entrega' : 'Retirada'}
              </span>
            </div>
            <div className="flex gap-2 mt-1">

              <button
                onClick={handlePrint}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Printer size={14} />
              </button>

              <button
                onClick={() => setEditing(!editing)}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setConfirmCancel(true)}
                style={{ color: '#EF4444' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>

        {confirmCancel && (
          <div
            className="rounded-xl p-3 flex flex-col gap-2"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>
              Cancelar pedido #{order.code}?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                Sim, cancelar
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {editing && (
          <form onSubmit={handleEdit} className="flex flex-col gap-2">
            <input
              name="customer_name"
              defaultValue={order.customer_name}
              placeholder="Nome"
              required
              className="w-full px-3 py-2 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
            <input
              name="phone"
              defaultValue={order.phone}
              placeholder="Telefone"
              required
              className="w-full px-3 py-2 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
            <select
              name="type"
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl outline-none text-sm"
              style={inputStyle}
            >
              <option value="pickup">Retirada</option>
              <option value="delivery">Entrega</option>
            </select>
            {type === 'delivery' && (
              <input
                name="address"
                defaultValue={order.address || ''}
                placeholder="Endereço"
                className="w-full px-3 py-2 rounded-xl outline-none text-sm"
                style={inputStyle}
              />
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-xl text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {order.type === 'delivery' && order.address && !editing && (
          <p
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text-muted)',
            }}
          >
            📍 {order.address}
          </p>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'itens'}
        </button>

        {expanded && (
          <div className="flex flex-col gap-1">
            {order.order_items.map((item: any) => (
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
          </div>
        )}

        {next && (
          <button
            onClick={handleUpdateStatus}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{
              backgroundColor: statusColors[next],
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Atualizando...' : nextStatusLabel[order.status as OrderStatus]}
          </button>
        )}
      </div>
      {/* Comanda oculta para impressão */}
<div style={{ display: 'none' }}>
  <OrderReceipt order={order} />
</div>
    </div>
  )
}