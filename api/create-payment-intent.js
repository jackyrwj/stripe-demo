const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === "POST") {
    try {
      const { amount, currency = "usd", description = "商品购买" } = req.body;
      
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ Stripe 密钥未配置');
        return res.status(500).json({ error: 'Stripe 密钥未配置' });
      }
      
      if (!amount || amount < 50) {
        console.log('❌ 金额验证失败:', amount);
        return res.status(400).json({ error: "金额必须至少为 0.50 USD（50 分）" });
      }
      
      console.log('✅ 创建支付意图, 金额:', amount);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency,
        description,
        metadata: { integration_check: "accept_a_payment" },
      });
      
      console.log('✅ 支付意图创建成功:', paymentIntent.id);
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error('❌ 创建支付意图失败:', error.message);
      res.status(500).json({ error: "创建支付意图失败", message: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
