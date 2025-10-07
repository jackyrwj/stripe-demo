const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// 初始化 Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stripe 支付服务器运行正常' });
});

// 创建支付意图
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', description = '商品购买' } = req.body;

    // 验证金额
    if (!amount || amount < 50) {
      return res.status(400).json({ 
        error: '金额必须至少为 0.50 USD（50 分）' 
      });
    }

    // 创建支付意图
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount), // 确保是整数（分为单位）
      currency,
      description,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('创建支付意图时出错:', error);
    res.status(500).json({ 
      error: '创建支付意图失败',
      message: error.message 
    });
  }
});

// 确认支付状态
app.get('/payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripeClient.paymentIntents.retrieve(id);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      description: paymentIntent.description,
    });
  } catch (error) {
    console.error('获取支付状态时出错:', error);
    res.status(500).json({ 
      error: '获取支付状态失败',
      message: error.message 
    });
  }
});

// 获取支付方法
app.get('/payment-methods', async (req, res) => {
  try {
    // 这里可以根据需要返回支持的支付方法
    res.json({
      paymentMethods: [
        { type: 'card', name: '信用卡/借记卡' },
        { type: 'apple_pay', name: 'Apple Pay' },
        { type: 'google_pay', name: 'Google Pay' }
      ]
    });
  } catch (error) {
    console.error('获取支付方法时出错:', error);
    res.status(500).json({ 
      error: '获取支付方法失败',
      message: error.message 
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: err.message 
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: '接口不存在',
    message: `找不到 ${req.method} ${req.originalUrl}` 
  });
});

app.listen(port, () => {
  console.log(`🚀 Stripe 支付服务器运行在端口 ${port}`);
  console.log(`📍 健康检查: http://localhost:${port}/health`);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  警告: 未找到 STRIPE_SECRET_KEY 环境变量');
    console.log('请在 .env 文件中设置你的 Stripe 密钥');
  }
});
