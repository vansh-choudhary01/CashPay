import { useState } from 'react'
import { useRouter } from 'next/router'
import { loadCart, clearCart } from '../store/cart'
import type { CartItem } from '../store/cart'
import Script from 'next/script'

/**
 * Payment page that integrates Razorpay for UPI payments. It creates a Razorpay order
 * via the internal API route and opens the Razorpay checkout with UPI as the only method.
 */
export default function PaymentPage() {
  const items = loadCart()
  const total = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  )
  const router = useRouter()
  const [paying, setPaying] = useState(false)

  // Razorpay script is loaded using Next.js Script component. The script must
  // be included on the client side so that window.Razorpay is defined.

  const handlePay = async () => {
    if (paying) return
    setPaying(true)
    try {
      // Create order via API route; amount should be in rupees
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      const order = await res.json()
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: order.amount,
        currency: order.currency,
        name: 'CashPe Marketplace',
        description: 'Accessory Purchase',
        order_id: order.id,
        method: {
          upi: true,
          card: false,
          netbanking: false,
        },
        prefill: {
          name: 'CashPe User',
          email: 'user@example.com',
          contact: '9999999999',
        },
        handler: function (response: any) {
          clearCart()
          alert('Payment successful!')
          router.push('/orders')
        },
        modal: {
          ondismiss: function () {
            setPaying(false)
          },
        },
        theme: { color: '#34d399' },
      }
      // Ensure Razorpay SDK is available on the client window
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Payment failed')
      setPaying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Load Razorpay Checkout SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <h1 className="text-2xl font-semibold">Complete Payment</h1>
      {items.length === 0 ? (
        <p>No items to pay for.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-white/10 pb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹ {item.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <p className="text-right font-semibold mt-2">
              Total: ₹ {total.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={handlePay}
            disabled={paying}
            className="h-10 px-5 rounded-md bg-emerald-500 text-black font-medium w-full"
          >
            {paying ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>
        </>
      )}
    </div>
  )
}