'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CartItem, Product, WishlistItem, Coupon } from '@/lib/types'

interface CartContextType {
  cart: CartItem[]
  wishlist: WishlistItem[]
  coupon: Coupon | null
  discount: number
  isLoading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Load cart & wishlist on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Load from Supabase
        const { data: cartData } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('customer_id', user.id)

        const { data: wishData } = await supabase
          .from('wishlist')
          .select('*, products(*)')
          .eq('customer_id', user.id)

        if (cartData) {
          setCart(
            cartData.map((item: any) => ({
              id: item.id,
              session_id: item.session_id,
              customer_id: item.customer_id,
              product_id: item.product_id,
              quantity: item.quantity,
              created_at: item.created_at,
              product: item.products,
            }))
          )
        }

        if (wishData) {
          setWishlist(
            wishData.map((item: any) => ({
              id: item.id,
              customer_id: item.customer_id,
              product_id: item.product_id,
              created_at: item.created_at,
              product: item.products,
            }))
          )
        }
      } else {
        // Load from LocalStorage
        const localCart = localStorage.getItem('gmb_cart')
        const localWish = localStorage.getItem('gmb_wishlist')

        if (localCart) setCart(JSON.parse(localCart))
        if (localWish) setWishlist(JSON.parse(localWish))
      }
      setIsLoading(false)
    }

    loadData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadData()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sync Guest Cart to LocalStorage
  const saveLocalCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('gmb_cart', JSON.stringify(newCart))
  }

  const saveLocalWish = (newWish: WishlistItem[]) => {
    setWishlist(newWish)
    localStorage.setItem('gmb_wishlist', JSON.stringify(newWish))
  }

  // Cart Operations
  const addToCart = async (product: Product, quantity = 1) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Find if item exists in DB
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('customer_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existing) {
        const newQty = existing.quantity + quantity
        await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', existing.id)

        setCart(prev =>
          prev.map(item =>
            item.product_id === product.id ? { ...item, quantity: newQty } : item
          )
        )
      } else {
        const { data: inserted, error } = await supabase
          .from('cart_items')
          .insert({
            customer_id: user.id,
            product_id: product.id,
            quantity: quantity,
          })
          .select()
          .single()

        if (inserted) {
          setCart(prev => [
            ...prev,
            {
              id: inserted.id,
              session_id: null,
              customer_id: user.id,
              product_id: product.id,
              quantity: quantity,
              created_at: inserted.created_at,
              product: product,
            },
          ])
        }
      }
    } else {
      // LocalStorage logic
      const existingIdx = cart.findIndex(item => item.product_id === product.id)
      if (existingIdx > -1) {
        const newCart = [...cart]
        newCart[existingIdx].quantity += quantity
        saveLocalCart(newCart)
      } else {
        const newItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          session_id: 'guest',
          customer_id: null,
          product_id: product.id,
          quantity: quantity,
          created_at: new Date().toISOString(),
          product: product,
        }
        saveLocalCart([...cart, newItem])
      }
    }
  }

  const removeFromCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('customer_id', user.id)
        .eq('product_id', productId)

      setCart(prev => prev.filter(item => item.product_id !== productId))
    } else {
      saveLocalCart(cart.filter(item => item.product_id !== productId))
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('customer_id', user.id)
        .eq('product_id', productId)

      setCart(prev =>
        prev.map(item => (item.product_id === productId ? { ...item, quantity } : item))
      )
    } else {
      saveLocalCart(
        cart.map(item => (item.product_id === productId ? { ...item, quantity } : item))
      )
    }
  }

  // Wishlist Operations
  const addToWishlist = async (product: Product) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: inserted } = await supabase
        .from('wishlist')
        .insert({
          customer_id: user.id,
          product_id: product.id,
        })
        .select()
        .single()

      if (inserted) {
        setWishlist(prev => [
          ...prev,
          {
            id: inserted.id,
            customer_id: user.id,
            product_id: product.id,
            created_at: inserted.created_at,
            product: product,
          },
        ])
      }
    } else {
      if (!wishlist.some(item => item.product_id === product.id)) {
        const newItem: WishlistItem = {
          id: Math.random().toString(36).substr(2, 9),
          customer_id: 'guest',
          product_id: product.id,
          created_at: new Date().toISOString(),
          product: product,
        }
        saveLocalWish([...wishlist, newItem])
      }
    }
  }

  const removeFromWishlist = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('customer_id', user.id)
        .eq('product_id', productId)

      setWishlist(prev => prev.filter(item => item.product_id !== productId))
    } else {
      saveLocalWish(wishlist.filter(item => item.product_id !== productId))
    }
  }

  // Coupons
  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const { data: couponData, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !couponData) return false

      // Check expiry
      if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
        return false
      }

      // Check min order
      const subtotal = getCartSubtotal()
      if (subtotal < couponData.min_order_amount) {
        return false
      }

      setCoupon(couponData)
      if (couponData.discount_type === 'percent') {
        const calculated = (subtotal * couponData.discount_value) / 100
        setDiscount(calculated)
      } else {
        setDiscount(Number(couponData.discount_value))
      }
      return true
    } catch {
      return false
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
    setDiscount(0)
  }

  // Calc totals
  const getCartSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
  }

  const getCartTotal = () => {
    const sub = getCartSubtotal()
    return Math.max(0, sub - discount)
  }

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('cart_items').delete().eq('customer_id', user.id)
    }
    setCart([])
    localStorage.removeItem('gmb_cart')
    removeCoupon()
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        discount,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        applyCoupon,
        removeCoupon,
        getCartTotal,
        getCartSubtotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
