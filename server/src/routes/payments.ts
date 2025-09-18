import { Router } from 'express'
import { z } from 'zod'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { ENV } from '../config/env'

const router = Router()

// ----- Razorpay -----
const createOrderSchema = z.object({ amount: z.number().positive(), currency: z.string().default('INR'), receipt: z.string().optional() })

router.post('/razorpay/order', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const instance = new Razorpay({ key_id: ENV.RAZORPAY_KEY_ID, key_secret: ENV.RAZORPAY_KEY_SECRET })
  const order = await instance.orders.create({ amount: Math.round(parsed.data.amount * 100), currency: parsed.data.currency, receipt: parsed.data.receipt })
  res.json({ order })
})

const verifySchema = z.object({ order_id: z.string(), payment_id: z.string(), signature: z.string() })

router.post('/razorpay/verify', async (req, res) => {
  const parsed = verifySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { order_id, payment_id, signature } = parsed.data
  const body = `${order_id}|${payment_id}`
  const expected = crypto.createHmac('sha256', ENV.RAZORPAY_KEY_SECRET).update(body).digest('hex')
  const valid = expected === signature
  res.json({ valid })
})

// ----- Paytm Stubs -----
// Note: Implement production-grade checksums using Paytm's SDK when keys are available.
const paytmInitSchema = z.object({ amount: z.number().positive(), orderId: z.string(), customerId: z.string() })

router.post('/paytm/init', async (req, res) => {
  const parsed = paytmInitSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  // Return minimal payload to proceed on client. Integrate official SDK for prod.
  res.json({
    txnToken: 'stub-token',
    orderId: parsed.data.orderId,
    amount: parsed.data.amount,
    mid: process.env.PAYTM_MID,
    callbackUrl: process.env.PAYTM_CALLBACK_URL,
  })
})

router.post('/paytm/callback', async (_req, res) => {
  // Verify checksum, update payment/order status accordingly
  res.json({ received: true })
})

export default router
