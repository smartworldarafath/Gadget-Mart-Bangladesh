'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/utils'

type CheckoutStep = 'info' | 'shipping' | 'payment' | 'confirm'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartSubtotal, discount, getCartTotal, clearCart } = useCart()
  const supabase = createClient()
  
  const [step, setStep] = useState<CheckoutStep>('info')
  const [user, setUser] = useState<any>(null)
  
  // Shipping details state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka', // Default
    district: '',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  })
  
  const [shippingCharge, setShippingCharge] = useState(60) // Dhaka default
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        // Fetch details from customer profile
        supabase
          .from('customers')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data: customer }) => {
            if (customer) {
              setForm(prev => ({
                ...prev,
                name: customer.full_name || '',
                phone: customer.phone || '',
                email: customer.email || data.user.email || '',
                address: customer.address || '',
                city: customer.city || 'Dhaka',
                district: customer.district || ''
              }))
              
              if (customer.city && customer.city.toLowerCase() !== 'dhaka') {
                setShippingCharge(120)
              }
            }
          })
      }
    })
  }, [])

  // Check if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      router.push('/cart')
    }
  }, [cart])

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value
    setForm(prev => ({ ...prev, city }))
    if (city.toLowerCase() === 'dhaka') {
      setShippingCharge(60)
    } else {
      setShippingCharge(120)
    }
  }

  const handleStepSubmit = (e: React.FormEvent, nextStep: CheckoutStep) => {
    e.preventDefault()
    setStep(nextStep)
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    
    try {
      const { data: authData } = await supabase.auth.getUser()
      const customerId = authData.user?.id || null
      
      const subtotal = getCartSubtotal()
      const totalAmount = subtotal + shippingCharge - discount
      
      const orderNumber = `GMB-${Date.now().toString().slice(-6)}-ORD`

      // 1. Insert Order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_district: form.district || form.city,
          payment_method: form.paymentMethod,
          payment_status: 'pending',
          order_status: 'pending',
          subtotal: subtotal,
          shipping_charge: shippingCharge,
          discount: discount,
          total_amount: totalAmount,
          notes: form.notes || null
        })
        .select()
        .single()

      if (orderErr) throw orderErr

      // 2. Insert Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_image: item.product?.thumbnail_url || null,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        total_price: (item.product?.price || 0) * item.quantity
      }))

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsErr) throw itemsErr

      // 3. Clear Cart
      await clearCart()

      // Redirect to success
      router.push(`/order-success/${order.id}`)
    } catch (err: any) {
      alert(`Error placing order: ${err.message || 'Database connection error. Try again.'}`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = getCartSubtotal()
  const total = subtotal + shippingCharge - discount

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight mb-8 uppercase">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step indicators */}
          <div className="flex justify-between items-center bg-gray-50 border border-gray-150 p-4 rounded-2xl text-[10px] md:text-xs font-bold text-gray-500">
            <span className={step === 'info' ? 'text-primary font-black' : ''}>1. CUSTOMER INFO</span>
            <span>➔</span>
            <span className={step === 'shipping' ? 'text-primary font-black' : ''}>2. SHIPPING</span>
            <span>➔</span>
            <span className={step === 'payment' ? 'text-primary font-black' : ''}>3. PAYMENT</span>
            <span>➔</span>
            <span className={step === 'confirm' ? 'text-primary font-black' : ''}>4. CONFIRM</span>
          </div>

          {/* STEP 1: INFO FORM */}
          {step === 'info' && (
            <form onSubmit={(e) => handleStepSubmit(e, 'shipping')} className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-800 tracking-wider">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Phone Number * (Bangladeshi Format)</label>
                  <input
                    type="tel"
                    required
                    pattern="^01[3-9]\d{8}$"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer">
                  Continue to Shipping
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING FORM */}
          {step === 'shipping' && (
            <form onSubmit={(e) => handleStepSubmit(e, 'payment')} className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-800 tracking-wider">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">City / Region *</label>
                  <select
                    value={form.city}
                    onChange={handleCityChange}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium appearance-none"
                  >
                    <option value="Dhaka">Dhaka (৳60 shipping)</option>
                    <option value="Chittagong">Chittagong (৳120 shipping)</option>
                    <option value="Sylhet">Sylhet (৳120 shipping)</option>
                    <option value="Khulna">Khulna (৳120 shipping)</option>
                    <option value="Rajshahi">Rajshahi (৳120 shipping)</option>
                    <option value="Barisal">Barisal (৳120 shipping)</option>
                    <option value="Rangpur">Rangpur (৳120 shipping)</option>
                    <option value="Mymensingh">Mymensingh (৳120 shipping)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Street Address *</label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('info')} className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase text-gray-500 hover:bg-gray-50">Back</button>
                <button type="submit" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer">Continue to Payment</button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT FORM */}
          {step === 'payment' && (
            <form onSubmit={(e) => handleStepSubmit(e, 'confirm')} className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase text-gray-800 tracking-wider">Payment Method</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
                  className={`w-full p-4 border rounded-2xl text-left flex items-center justify-between ${
                    form.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black text-gray-800">Cash On Delivery</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Pay with cash when items are delivered to your home.</p>
                  </div>
                  <div className={`size-4.5 rounded-full border flex items-center justify-center ${
                    form.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {form.paymentMethod === 'cash_on_delivery' && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'bkash' }))}
                  className={`w-full p-4 border rounded-2xl text-left flex items-center justify-between ${
                    form.paymentMethod === 'bkash' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black text-gray-800">bKash (Mobile Wallet)</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Instruction code: Send money to GMB Agent wallet 01977-123456</p>
                  </div>
                  <div className={`size-4.5 rounded-full border flex items-center justify-center ${
                    form.paymentMethod === 'bkash' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {form.paymentMethod === 'bkash' && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Order Notes / Delivery instructions (Optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('shipping')} className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase text-gray-500 hover:bg-gray-50">Back</button>
                <button type="submit" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer">Review Order</button>
              </div>
            </form>
          )}

          {/* STEP 4: REVIEW CONFIRM */}
          {step === 'confirm' && (
            <div className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 space-y-6">
              <h3 className="text-sm font-black uppercase text-gray-800 tracking-wider">Confirm Your Order</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm font-semibold">
                <div>
                  <h4 className="text-gray-400 uppercase text-[10px] tracking-wider mb-1 font-bold">Delivery Contact</h4>
                  <p className="text-gray-800">{form.name}</p>
                  <p className="text-gray-500 mt-0.5">{form.phone}</p>
                  {form.email && <p className="text-gray-500">{form.email}</p>}
                </div>
                <div>
                  <h4 className="text-gray-400 uppercase text-[10px] tracking-wider mb-1 font-bold">Shipping Address</h4>
                  <p className="text-gray-800">{form.address}</p>
                  <p className="text-gray-500 mt-0.5">{form.city}, {form.district}</p>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5">
                <h4 className="text-gray-400 uppercase text-[10px] tracking-wider mb-2 font-bold">Selected Payment Method</h4>
                <p className="text-xs font-bold text-gray-800 uppercase">
                  {form.paymentMethod.replace(/_/g, ' ')}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('payment')} className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase text-gray-500 hover:bg-gray-50">Back</button>
                <button 
                  type="button" 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order (Confirm)'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Order Summary (Cart Items list) */}
        <div className="lg:col-span-1">
          <div className="bg-card-bg border border-gray-100 rounded-3xl p-5 md:p-6 space-y-6 sticky top-24">
            <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider pb-3 border-b border-gray-150">Order Items</h3>
            
            {/* Items */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {cart.map(item => (
                <div key={item.product_id} className="flex gap-3 items-center justify-between text-xs font-semibold">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-800 truncate">{item.product?.name}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{item.quantity} x {formatPrice(item.product?.price || 0)}</p>
                  </div>
                  <span className="text-gray-800 font-bold shrink-0">{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-150 pt-5 space-y-3 text-xs md:text-sm font-semibold">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-800 font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span className="text-gray-800 font-bold">{formatPrice(shippingCharge)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-discount-red">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-150 pt-3 flex justify-between text-sm font-extrabold">
                <span className="text-gray-800">Total</span>
                <span className="text-primary text-base">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
