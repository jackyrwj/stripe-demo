const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 检查环境变量
console.log('🔧 环境变量检查:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '已配置' : '❌ 未配置');
console.log('PORT:', process.env.PORT || 3001);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Stripe 支付 API
app.post('/create-payment-intent', async (req, res) => {
  console.log('💳 收到支付请求:', req.body);
  
  try {
    const { amount, currency = 'usd', description = '商品购买' } = req.body;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Stripe 密钥未配置');
      return res.status(500).json({ error: 'Stripe 密钥未配置' });
    }
    
    if (!amount || amount < 50) {
      console.log('❌ 金额验证失败:', amount);
      return res.status(400).json({ error: '金额必须至少为 0.50 USD（50 分）' });
    }
    
    console.log('✅ 创建支付意图, 金额:', amount);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      description,
      metadata: { integration_check: 'accept_a_payment' },
    });
    
    console.log('✅ 支付意图创建成功:', paymentIntent.id);
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('❌ 创建支付意图失败:', error.message);
    console.error('详细错误:', error);
    res.status(500).json({ error: '创建支付意图失败', message: error.message });
  }
});

// 托管前端静态文件
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`服务已启动，端口: ${port}`);
});
