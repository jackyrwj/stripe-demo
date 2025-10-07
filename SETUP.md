# 🚀 Stripe 支付演示项目完整指南

## 项目概述

这是一个完整的 Stripe 支付集成演示项目，展示了如何在 React 前端和 Node.js 后端中实现安全的在线支付。项目使用 Stripe 的沙盒环境，确保测试过程中不会产生真实费用。

## 🏗️ 项目架构

```
stripe-demo/
├── 📁 client/                 # React 前端应用
│   ├── 📁 public/             # 静态资源
│   ├── 📁 src/                # 源代码
│   │   ├── 📁 components/     # React 组件
│   │   ├── App.js             # 主应用组件
│   │   ├── index.js           # 应用入口
│   │   └── index.css          # 样式文件
│   ├── package.json           # 前端依赖配置
│   └── .env.example           # 前端环境变量示例
├── 📁 server/                 # Node.js 后端 API
│   ├── index.js               # 服务器主文件
│   ├── package.json           # 后端依赖配置
│   └── .env.example           # 后端环境变量示例
├── package.json               # 项目主配置
├── setup.sh                   # 自动设置脚本
└── README.md                  # 项目说明
```

## 🚀 快速开始

### 1. 前置要求

- Node.js (版本 14 或更高)
- npm 或 yarn
- Stripe 账户（免费注册）

### 2. 获取 Stripe 密钥

1. 访问 [Stripe 控制台](https://dashboard.stripe.com/)
2. 注册新账户或登录现有账户
3. 在左侧菜单中选择 "开发者" → "API 密钥"
4. 确保切换到 "测试数据" 模式
5. 复制以下密钥：
   - **发布密钥** (pk_test_...)
   - **私密密钥** (sk_test_...)

### 3. 环境配置

#### 后端配置
```bash
# 复制环境变量模板
cp server/.env.example server/.env

# 编辑 server/.env 文件，填入你的 Stripe 密钥
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
PORT=3001
```

#### 前端配置
```bash
# 复制环境变量模板
cp client/.env.example client/.env

# 编辑 client/.env 文件
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
REACT_APP_API_URL=http://localhost:3001
```

### 4. 安装和启动

```bash
# 安装所有依赖
npm run install-all

# 同时启动前端和后端
npm run dev
```

项目启动后：
- 前端：http://localhost:3000
- 后端：http://localhost:3001

## 🧪 测试支付

在 Stripe 沙盒环境中，使用以下测试卡号：

| 场景 | 卡号 | 描述 |
|------|------|------|
| ✅ **成功支付** | `4242 4242 4242 4242` | 立即成功的支付 |
| 🔐 **需要验证** | `4000 0025 0000 3155` | 需要 3D Secure 验证 |
| ❌ **支付被拒** | `4000 0000 0000 0002` | 支付会被拒绝 |
| 💳 **余额不足** | `4000 0000 0000 9995` | 模拟余额不足 |
| ⚡ **处理错误** | `4000 0000 0000 0119` | 处理失败 |

**其他测试信息：**
- **过期时间**：任何未来日期（如 12/25）
- **CVV**：任何 3 位数字（如 123）
- **邮政编码**：任何 5 位数字（如 12345）

## 🔧 功能特性

### 前端功能
- 🎨 现代化响应式 UI 设计
- 💳 集成 Stripe Elements 支付表单
- 📱 支持移动端和桌面端
- 🔄 实时支付状态更新
- ⚡ 动态金额设置
- 🛡️ 客户端验证

### 后端功能
- 🔒 安全的支付意图创建
- 📊 支付状态查询
- 🛡️ 输入验证和错误处理
- 🌐 CORS 支持
- 📝 详细的日志记录

### 安全特性
- 🔐 所有敏感信息通过 HTTPS 传输
- 🛡️ 不在前端存储信用卡信息
- 🔑 使用环境变量保护 API 密钥
- ✅ 服务器端支付验证

## 📝 API 文档

### 创建支付意图
```http
POST /create-payment-intent
Content-Type: application/json

{
  "amount": 2000,          // 金额（分为单位）
  "currency": "usd",       // 货币类型
  "description": "商品描述"  // 支付描述
}
```

### 查询支付状态
```http
GET /payment-intent/:id
```

### 健康检查
```http
GET /health
```

## 🔍 故障排除

### 常见问题

**1. 环境变量未设置**
```
错误：未找到 STRIPE_SECRET_KEY 环境变量
解决：检查 .env 文件是否存在且配置正确
```

**2. 端口冲突**
```
错误：端口 3000 或 3001 已被占用
解决：修改 .env 文件中的 PORT 配置
```

**3. CORS 错误**
```
错误：跨域请求被阻止
解决：确保后端已启动且 API_URL 配置正确
```

**4. 支付失败**
```
错误：支付创建失败
解决：检查 Stripe 密钥是否正确，是否处于测试模式
```

### 调试技巧

1. **查看浏览器控制台**：检查前端错误信息
2. **查看服务器日志**：检查后端运行状态
3. **验证环境变量**：确保所有密钥都正确配置
4. **检查网络请求**：使用浏览器开发者工具检查 API 调用

## 🚀 部署指南

### 生产环境部署

1. **获取生产环境密钥**
   - 在 Stripe 控制台切换到 "实时数据" 模式
   - 获取 `sk_live_` 和 `pk_live_` 开头的密钥

2. **配置环境变量**
   - 使用生产环境的 Stripe 密钥
   - 设置正确的 API_URL

3. **构建应用**
   ```bash
   cd client && npm run build
   ```

4. **部署建议**
   - 前端：Vercel, Netlify, AWS S3
   - 后端：Heroku, AWS EC2, DigitalOcean
   - 数据库：MongoDB Atlas, PostgreSQL

### 安全注意事项

- ✅ 启用 HTTPS
- ✅ 使用环境变量保护密钥
- ✅ 实现速率限制
- ✅ 添加支付验证 webhook
- ✅ 定期更新依赖包

## 📚 学习资源

- [Stripe 官方文档](https://stripe.com/docs)
- [React Stripe.js 文档](https://stripe.com/docs/stripe-js/react)
- [Stripe API 参考](https://stripe.com/docs/api)
- [支付集成最佳实践](https://stripe.com/docs/payments/accept-a-payment)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**⚠️ 重要提醒**：这是一个演示项目，仅用于学习目的。在生产环境中使用时，请确保实施适当的安全措施和错误处理。
