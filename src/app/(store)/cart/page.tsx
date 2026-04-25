import { createClient } from '@/lib/supabase/server'
import { CartContent } from '@/components/store/CartContent'

async function getDeliveryFee(): Promise<number> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'delivery_fee')
    .single()

  return data ? Number(data.value) : 0
}

export default async function CartPage() {
  const deliveryFee = await getDeliveryFee()

  return <CartContent deliveryFee={deliveryFee} />
}