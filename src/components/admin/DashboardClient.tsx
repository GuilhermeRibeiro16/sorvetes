'use client'

import { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react'

type Order = {
  id: string
  total: number
  status: string
  created_at: string
  order_items: any[]
}

type Props = {
  orders: Order[]
  startOfDay: string
  startOfWeek: string
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

export function DashboardClient({ orders, startOfDay, startOfWeek }: Props) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')

  const filtered = useMemo(() => {
    const start = period === 'day'
      ? new Date(startOfDay)
      : period === 'week'
      ? new Date(startOfWeek)
      : null

    if (!start) return orders
    return orders.filter(o => new Date(o.created_at) >= start)
  }, [orders, period, startOfDay, startOfWeek])

  const revenue = filtered.reduce((sum, o) => sum + o.total, 0)
  const count = filtered.length
  const delivered = filtered.filter(o => o.status === 'delivered').length
  const avgTicket = count > 0 ? revenue / count : 0

  const revenueByHour = useMemo(() => {
    if (period !== 'day') return []

    const hours: Record<number, number> = {}
    for (let i = 0; i < 24; i++) hours[i] = 0

    filtered.forEach(o => {
      const hour = new Date(o.created_at).getHours()
      hours[hour] += o.total
    })

    return Object.entries(hours)
      .filter(([h]) => Number(h) >= 8 && Number(h) <= 23)
      .map(([hour, total]) => ({
        hour: `${hour}h`,
        total: Number(total.toFixed(2)),
      }))
  }, [filtered, period])

  const revenueByDay = useMemo(() => {
    if (period === 'day') return []

    const days: Record<string, number> = {}

    filtered.forEach(o => {
      const date = new Date(o.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
      days[date] = (days[date] || 0) + o.total
    })

    return Object.entries(days).map(([date, total]) => ({
      date,
      total: Number(total.toFixed(2)),
    }))
  }, [filtered, period])

  const topProducts = useMemo(() => {
    const products: Record<string, { name: string; count: number; revenue: number }> = {}

    filtered.forEach(order => {
      order.order_items.forEach((item: any) => {
        if (!products[item.product_name]) {
          products[item.product_name] = { name: item.product_name, count: 0, revenue: 0 }
        }
        products[item.product_name].count += item.quantity
        products[item.product_name].revenue += item.unit_price * item.quantity
      })
    })

    return Object.values(products).sort((a, b) => b.count - a.count)
  }, [filtered])

  const peakHours = useMemo(() => {
    const hours: Record<number, number> = {}

    filtered.forEach(o => {
      const hour = new Date(o.created_at).getHours()
      hours[hour] = (hours[hour] || 0) + 1
    })

    return Object.entries(hours)
      .map(([hour, count]) => ({ hour: `${hour}h`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [filtered])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Dashboard
        </h2>
        <Tabs value={period} onValueChange={v => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="day">Hoje</TabsTrigger>
            <TabsTrigger value="week">7 dias</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Faturamento', value: formatPrice(revenue), icon: DollarSign },
          { label: 'Pedidos', value: count.toString(), icon: ShoppingBag },
          { label: 'Entregues', value: delivered.toString(), icon: TrendingUp },
          { label: 'Ticket médio', value: formatPrice(avgTicket), icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </CardTitle>
              <Icon size={16} style={{ color: 'var(--color-primary)' }} />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm" style={{ color: 'var(--color-text)' }}>
            {period === 'day' ? 'Faturamento por hora' : 'Faturamento por dia'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            {period === 'day' ? (
              <AreaChart data={revenueByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => formatPrice(v)} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-primary)"
                  fill="#FF6B9D22"
                />
              </AreaChart>
            ) : (
              <BarChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => formatPrice(v)} />
                <Bar dataKey="total" fill="var(--color-primary)" radius={4} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ color: 'var(--color-text)' }}>
              Produtos mais vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {topProducts.slice(0, 5).map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--color-text)' }}>{p.name}</span>
                </div>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {p.count}x
                </span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Sem dados ainda
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm" style={{ color: 'var(--color-text)' }}>
              Horários de pico
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {peakHours.map((h, i) => (
              <div key={h.hour} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: i === 0 ? 'var(--color-secondary)' : 'var(--color-text-muted)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--color-text)' }}>{h.hour}</span>
                </div>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {h.count} pedidos
                </span>
              </div>
            ))}
            {peakHours.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Sem dados ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}