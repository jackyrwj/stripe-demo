import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';

// 从环境变量中获取 Stripe 公开密钥
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [amount, setAmount] = useState(2000); // 默认 $20.00 (以分为单位)
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 创建支付意图
  const createPaymentIntent = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          description: 'Stripe 演示商品购买',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建支付失败');
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理金额变化
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) * 100; // 转换为分
    setAmount(Math.round(value));
  };

  // Stripe Elements 的选项
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6B73FF',
        colorBackground: '#ffffff',
        colorText: '#333333',
        colorDanger: '#ff4757',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="app">
      <div className="container">
        {/* 头部 */}
        <div className="header">
          <h1>🚀 Stripe 支付演示</h1>
          <p>安全、快速的在线支付体验</p>
        </div>

        <div className="content">
          {/* 商品展示区域 */}
          <div className="product-section">
            <div className="product-card">
              <div className="product-title">💎 高级会员服务</div>
              <div className="product-description">
                享受全方位的高级功能，包括无限制访问、优先客服支持和独家内容。
              </div>
              <div className="product-price">
                ${(amount / 100).toFixed(2)} USD
              </div>
              
              <div className="amount-selector">
                <label htmlFor="amount">自定义金额:</label>
                <input
                  id="amount"
                  type="number"
                  min="0.50"
                  step="0.01"
                  defaultValue={(amount / 100).toFixed(2)}
                  onChange={handleAmountChange}
                  className="amount-input"
                  placeholder="输入金额"
                />
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}

          {/* 支付表单 */}
          {!clientSecret ? (
            <div className="checkout-form">
              <div className="form-title">准备支付</div>
              <button
                onClick={createPaymentIntent}
                disabled={loading || amount < 50}
                className="pay-button"
              >
                {loading ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    创建支付中...
                  </div>
                ) : (
                  `立即支付 $${(amount / 100).toFixed(2)}`
                )}
              </button>
              
              {amount < 50 && (
                <div className="error">
                  最小支付金额为 $0.50
                </div>
              )}
            </div>
          ) : (
            <Elements options={options} stripe={stripePromise} key={clientSecret}>
              <CheckoutForm 
                amount={amount}
                onSuccess={() => {
                  setClientSecret('');
                  setAmount(2000);
                }}
                onError={setError}
              />
            </Elements>
          )}

          {/* 测试卡号信息 */}
          <div className="test-cards">
            <h3>🧪 测试卡号（沙盒环境）</h3>
            <ul>
              <li><strong>成功支付:</strong> 4242 4242 4242 4242</li>
              <li><strong>需要验证:</strong> 4000 0025 0000 3155</li>
              <li><strong>拒绝支付:</strong> 4000 0000 0000 0002</li>
            </ul>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              过期时间：任何未来日期 | CVV：任何3位数字 | 邮编：任何5位数字
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
