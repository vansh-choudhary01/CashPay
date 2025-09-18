import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import {
  devicesByCategory,
  conditionMultipliers,
  storageMultipliers,
} from '../../data/devices'
import { createOrder } from '../../store/orders'

/**
 * Dynamic page to sell a specific gadget category.
 */
export default function SellCategoryPage() {
  const router = useRouter()
  const { category } = router.query
  // Ensure catSlug is string
  const catSlug = typeof category === 'string' ? category : ''

  const pretty = catSlug
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const models = useMemo(() => {
    const key = catSlug as keyof typeof devicesByCategory
    return devicesByCategory[key] || []
  }, [catSlug])

  const [brand, setBrand] = useState(models[0]?.brand || '')
  const [model, setModel] = useState(models[0]?.model || '')
  const [condition, setCondition] = useState<keyof typeof conditionMultipliers>('Like New')
  const [storage, setStorage] = useState<keyof typeof storageMultipliers>('128 GB')

  // Update brand and model once models array is ready
  useEffect(() => {
    if (models.length) {
      setBrand(models[0].brand)
      setModel(models[0].model)
    }
  }, [models])

  const basePrice = useMemo(() => {
    return models.find((m) => m.model === model)?.basePrice || 20000
  }, [models, model])

  const price = Math.round(
    basePrice * (conditionMultipliers[condition] || 1) * (storageMultipliers[storage] || 1),
  )

  const filteredModels = models.filter((m) => m.brand === brand)

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sell {pretty}</h1>
        <Link href="/sell" className="text-sm text-neutral-300 hover:text-white">
          Back to categories
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="w-8 h-8 rounded bg-emerald-400/20 mb-3" />
          <div className="font-medium mb-1">Tell us about your device</div>
          <div className="text-sm text-neutral-300">Brand, model, condition</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="w-8 h-8 rounded bg-emerald-400/20 mb-3" />
          <div className="font-medium mb-1">Get instant quote</div>
          <div className="text-sm text-neutral-300">Transparent and best market price</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="w-8 h-8 rounded bg-emerald-400/20 mb-3" />
          <div className="font-medium mb-1">Free pickup &amp; instant cash</div>
          <div className="text-sm text-neutral-300">Doorstep service, secure payment</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Brand</label>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value)
                setModel(models.find((m) => m.brand === e.target.value)?.model || '')
              }}
              className="w-full glass rounded-md h-10 px-3"
            >
              {[...new Set(models.map((m) => m.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full glass rounded-md h-10 px-3"
            >
              {filteredModels.map((m) => (
                <option key={m.model}>{m.model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as keyof typeof conditionMultipliers)}
              className="w-full glass rounded-md h-10 px-3"
            >
              {Object.keys(conditionMultipliers).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Storage</label>
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value as keyof typeof storageMultipliers)}
              className="w-full glass rounded-md h-10 px-3"
            >
              {Object.keys(storageMultipliers).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-300">Estimated quote</div>
          <div className="text-2xl font-bold text-emerald-400">
            ₹ {price.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="h-10 px-4 rounded-md bg-emerald-500 text-black font-medium"
            onClick={() => {
              const order = createOrder({
                category: catSlug,
                brand,
                model,
                storage,
                condition,
                price,
              } as any)
              router.push(`/checkout/${order.id}`)
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}