#!/bin/bash

echo "🚀 Stripe 支付演示项目设置脚本"
echo "================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 安装根目录依赖
echo "📦 安装根目录依赖..."
npm install

# 安装服务器依赖
echo "📦 安装服务器依赖..."
cd server
npm install
cd ..

# 安装客户端依赖
echo "📦 安装客户端依赖..."
cd client
npm install
cd ..

echo ""
echo "🎉 依赖安装完成！"
echo ""
echo "⚠️  下一步操作："
echo "1. 注册或登录 Stripe 账户: https://dashboard.stripe.com/"
echo "2. 获取测试环境的 API 密钥"
echo "3. 复制 server/.env.example 为 server/.env 并填入密钥"
echo "4. 复制 client/.env.example 为 client/.env 并填入密钥"
echo "5. 运行 'npm run dev' 启动项目"
echo ""
echo "📚 详细说明请查看 README.md 文件"
