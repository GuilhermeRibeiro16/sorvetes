import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardClient } from '@/components/admin/DashboardClient'

export const dynamic = 'force-dynamic'
async function getDashboardData() {
  const supabase = createAdminClient()

  const now = new Date()

  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 7)
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .neq('status', 'cancelled')
    .gte('created_at', startOfMonth.toISOString())
    .order('created_at', { ascending: true })

  return { orders: orders || [], startOfDay, startOfWeek }
}

export default async function DashboardPage() {
  const { orders, startOfDay, startOfWeek } = await getDashboardData()

  return <DashboardClient
    orders={orders}
    startOfDay={startOfDay.toISOString()}
    startOfWeek={startOfWeek.toISOString()}
  />
}