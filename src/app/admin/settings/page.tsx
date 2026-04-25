import { createAdminClient } from '@/lib/supabase/admin'
import { SettingsForm } from '@/components/admin/SettingsForm'


async function getSettings() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('settings')
    .select('*')

  return data || []
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  const getValue = (key: string) =>
    settings.find(s => s.key === key)?.value || ''

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Configurações
      </h2>
      <SettingsForm
        storeName={getValue('store_name')}
        deliveryFee={getValue('delivery_fee')}
        openingTime={getValue('opening_time')}
        closingTime={getValue('closing_time')}
        workingDays={getValue('working_days')}
      />
    </div>
  )
}