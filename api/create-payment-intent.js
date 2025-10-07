const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { amount, currency = "usd", description = "商品购买" } = req.body;
      if (!amount || amount < 50) {
        res.status(400).json({ error: "金额必须至少为 0.50 USD（50 分）" });
        return;
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency,
        description,
        metadata: { integration_check: "accept_a_payment" },
      });
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "创建支付意图失败", message: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
