'use client'

import { useEffect, useState } from 'react'

type StoreStatusBadgeProps = {
  openingTime: string
  closingTime: string
  workingDays: string
}

export function useStoreOpen(openingTime: string, closingTime: string, workingDays: string) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
function check() {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const current = hours * 60 + minutes

  const [openH, openM] = openingTime.split(':').map(Number)
  const [closeH, closeM] = closingTime.split(':').map(Number)
  const open = openH * 60 + openM
  const close = closeH * 60 + closeM

  const days = workingDays.split(',').map(Number)
  const isDayOpen = days.includes(day)

  // Trata virada da meia noite
  let isTimeOpen
  if (close < open) {
    // Ex: abre 22h fecha 03h
    isTimeOpen = current >= open || current < close
  } else {
    isTimeOpen = current >= open && current < close
  }

  setIsOpen(isDayOpen && isTimeOpen)
}

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [openingTime, closingTime, workingDays])

  return isOpen
}

export function StoreStatusBadge({
  openingTime,
  closingTime,
  workingDays,
}: StoreStatusBadgeProps) {
  const isOpen = useStoreOpen(openingTime, closingTime, workingDays)

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: isOpen ? '#10B981' : '#EF4444' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full bg-white"
        style={{ opacity: 0.8 }}
      />
      {isOpen ? 'Aberto' : 'Fechado'}
    </div>
  )
}