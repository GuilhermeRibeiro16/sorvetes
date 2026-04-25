import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { OrderTracker } from '@/components/store/OrderTracker'

async function getOrder(code: string) {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('orders')
    .select(`*, order_items(*, order_item_options(*))`)
    .eq('code', code)
    .single()

  return data
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const order = await getOrder(code)

  if (!order) notFound()

  return <OrderTracker initialOrder={order} />
}