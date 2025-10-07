import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    onError('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
        onError(error.message);
      } else {
        setMessage('支付过程中发生未知错误，请重试。');
        onError('支付过程中发生未知错误，请重试。');
      }
    } else {
      // 支付成功
      setMessage('✅ 支付成功！感谢您的购买。');
      onSuccess();
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className="checkout-form">
      <div className="form-title">💳 安全支付</div>
      
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="payment-element">
          <PaymentElement 
            id="payment-element" 
            options={paymentElementOptions}
          />
        </div>
        
        <button 
          disabled={isLoading || !stripe || !elements} 
          id="submit"
          className="pay-button"
        >
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              处理支付中...
            </div>
          ) : (
            `确认支付 $${(amount / 100).toFixed(2)}`
          )}
        </button>
        
        {/* 显示错误或成功消息 */}
        {message && (
          <div className={message.includes('✅') ? 'success' : 'error'}>
            {message}
          </div>
        )}
      </form>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#0066cc'
      }}>
        🔒 您的支付信息通过 Stripe 进行加密保护，我们不会存储您的卡片信息。
      </div>
    </div>
  );
}
