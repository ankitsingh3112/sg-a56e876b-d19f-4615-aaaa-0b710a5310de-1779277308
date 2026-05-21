import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

type OrderData = {
  orderId: string;
  amount: number;
  currency: string;
};

type ErrorData = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderData | ErrorData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency = "INR", receipt } = req.body;

    // Validate amount (minimum 100 paise = 1 INR)
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Amount must be at least 100 paise (₹1)" });
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: Number(amount), // amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    
    if (error.statusCode === 401) {
      return res.status(401).json({ error: "Authentication failed. Check Razorpay credentials." });
    }
    
    res.status(500).json({ 
      error: error.message || "Failed to create order" 
    });
  }
}