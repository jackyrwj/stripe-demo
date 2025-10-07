# Stripe 支付演示项目

这是一个使用 Stripe 支付网关的完整演示项目，包含前端 React 应用和后端 Node.js API。

## 功能特性

- 🔥 React 前端界面
- 🚀 Node.js Express 后端 API
- 💳 Stripe 支付集成（沙盒环境）
- 🎨 现代化 UI 设计
- 📱 响应式布局
- 🔒 安全的支付处理

## 项目结构

```
stripe-demo/
├── client/          # React 前端应用
├── server/          # Node.js 后端 API
├── package.json     # 项目配置文件
└── README.md        # 项目说明文档
```

## 快速开始

### 1. 安装依赖

```bash
npm run install-all
```

### 2. 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PORT=3001
```

在 `client` 目录下创建 `.env` 文件：

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_API_URL=http://localhost:3001
```

### 3. 获取 Stripe 密钥

1. 访问 [Stripe 控制台](https://dashboard.stripe.com/)
2. 注册或登录账户
3. 在开发者页面获取测试环境的密钥
4. 将密钥填入上述环境变量文件

### 4. 启动项目

```bash
npm run dev
```

这将同时启动：
- 前端应用：http://localhost:3000
- 后端 API：http://localhost:3001

## 测试支付

在 Stripe 沙盒环境中，你可以使用以下测试卡号：

- **成功支付**: 4242 4242 4242 4242
- **需要验证**: 4000 0025 0000 3155
- **拒绝支付**: 4000 0000 0000 0002

有效期：任何未来日期  
CVV：任何 3 位数字  
邮编：任何 5 位数字

## 技术栈

- **前端**: React, Stripe.js, CSS3
- **后端**: Node.js, Express, Stripe SDK
- **工具**: Concurrently（并发运行）

## 支持的支付方式

- 信用卡/借记卡
- Apple Pay（在支持的设备上）
- Google Pay（在 Chrome 浏览器中）

## 注意事项

- 此项目仅用于演示目的
- 使用的是 Stripe 测试环境，不会产生真实费用
- 生产环境部署时需要配置 HTTPS
