import { createAdminClient } from '@/lib/supabase/admin'
import { AdminOrderCard } from '@/components/admin/OrderCard'

async function getOrdersToday() {
  const supabase = createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data } = await supabase
    .from('orders')
    .select(`*, order_items(*, order_item_options(*))`)
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  return data || []
}

export default async function AdminOrdersPage() {
  const orders = await getOrdersToday()

  const active = orders.filter(o => o.status !== 'delivered')
  const delivered = orders.filter(o => o.status === 'delivered')

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Pedidos de hoje
        </h2>
        <span
          className="text-sm px-3 py-1 rounded-full font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {active.length} ativos
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total hoje', value: orders.length.toString() },
          { label: 'Entregues', value: delivered.length.toString() },
          { label: 'Faturamento', value: formatPrice(totalRevenue) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl p-3 flex flex-col gap-1"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </p>
            <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {active.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Nenhum pedido ativo no momento.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {active.map(order => (
          <AdminOrderCard key={order.id} order={order} />
        ))}
      </div>

      {delivered.length > 0 && (
        <>
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Entregues hoje
          </h3>
          <div className="flex flex-col gap-3">
            {delivered.map(order => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}