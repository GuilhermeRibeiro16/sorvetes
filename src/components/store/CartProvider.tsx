'use client'
import { SelectedOption } from '@/hooks/useCart'
import { createContext, useContext } from 'react'
import { useCart, CartItem } from '@/hooks/useCart'
import { Product } from '@/types'

type CartContextType = {
  items: CartItem[]
  total: number
  itemCount: number
  loaded: boolean
  addItem: (product: Product, selectedOptions: SelectedOption[], itemTotal: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart()

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCartContext deve ser usado dentro de CartProvider')
  }

  return context
}