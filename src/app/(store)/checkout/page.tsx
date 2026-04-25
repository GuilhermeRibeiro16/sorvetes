import { createClient } from '@/lib/supabase/server'
import { CheckoutContent } from '@/components/store/CheckoutContent'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*')
  const getValue = (key: string) => data?.find((s: any) => s.key === key)?.value || ''
  return {
    openingTime: getValue('opening_time'),
    closingTime: getValue('closing_time'),
    workingDays: getValue('working_days'),
  }
}

export default async function CheckoutPage() {
  const settings = await getSettings()
  return <CheckoutContent {...settings} />
}