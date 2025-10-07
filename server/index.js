const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API 路由
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", description = "商品购买" } = req.body;
    if (!amount || amount < 50) {
      return res
        .status(400)
        .json({ error: "金额必须至少为 0.50 USD（50 分）" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      description,
      metadata: { integration_check: "accept_a_payment" },
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: "创建支付意图失败", message: error.message });
  }
});

// 托管前端静态文件
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`服务已启动，端口: ${port}`);
});
