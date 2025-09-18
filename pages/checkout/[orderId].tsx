import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getOrder, updateOrder, type Order } from '../../store/orders'

/**
 * Checkout page: collects customer information and schedules pickup.
 */
export default function CheckoutPage() {
  const router = useRouter()
  const { orderId } = router.query
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pickupAt, setPickupAt] = useState('')

  useEffect(() => {
    if (typeof orderId === 'string') {
      const o = getOrder(orderId)
      setOrder(o)
    }
  }, [orderId])

  if (!order) {
    return <div className="max-w-6xl mx-auto py-8">Order not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">
            {order.brand} {order.model}
          </div>
          <div className="text-neutral-300">
            {order.condition} • {order.storage}
          </div>
        </div>
        <div className="font-semibold text-emerald-400">
          ₹ {order.price.toLocaleString('en-IN')}
        </div>
      </div>
      <div className="glass rounded-xl p-6 grid gap-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass rounded-md h-10 px-3"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full glass rounded-md h-10 px-3"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full glass rounded-md px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pickup time</label>
          <input
            type="datetime-local"
            value={pickupAt}
            onChange={(e) => setPickupAt(e.target.value)}
            className="w-full glass rounded-md h-10 px-3"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="h-10 px-4 rounded-md bg-emerald-500 text-black font-medium"
            onClick={() => {
              if (typeof orderId === 'string') {
                updateOrder(orderId, {
                  customer: {
                    name,
                    phone,
                    address,
                    pickupAt,
                  },
                })
                router.push('/orders')
              }
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}