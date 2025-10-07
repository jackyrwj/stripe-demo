#!/bin/bash

echo "🔍 Stripe 支付演示项目验证"
echo "=========================="

# 检查项目结构
echo "📁 检查项目结构..."

REQUIRED_FILES=(
    "package.json"
    "server/package.json"
    "server/index.js"
    "client/package.json"
    "client/src/App.js"
    "client/src/components/CheckoutForm.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ 缺失文件: $file"
        exit 1
    fi
done

# 检查依赖安装
echo ""
echo "📦 检查依赖安装..."

if [ -d "node_modules" ]; then
    echo "✅ 根目录依赖已安装"
else
    echo "❌ 根目录依赖未安装"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ 服务器依赖已安装"
else
    echo "❌ 服务器依赖未安装"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ 客户端依赖已安装"
else
    echo "❌ 客户端依赖未安装"
fi

# 检查环境变量配置
echo ""
echo "🔧 检查环境变量配置..."

if [ -f "server/.env" ]; then
    echo "✅ 服务器环境变量已配置"
    if grep -q "sk_test_" server/.env && grep -q "pk_test_" server/.env; then
        echo "✅ Stripe 密钥已配置"
    else
        echo "⚠️  请在 server/.env 中配置 Stripe 密钥"
    fi
else
    echo "⚠️  请创建 server/.env 文件"
    echo "   可以复制 server/.env.example 并填入你的 Stripe 密钥"
fi

if [ -f "client/.env" ]; then
    echo "✅ 客户端环境变量已配置"
else
    echo "⚠️  请创建 client/.env 文件"
    echo "   可以复制 client/.env.example 并填入你的 Stripe 公开密钥"
fi

echo ""
echo "📋 下一步操作："
echo "1. 如果还没有 Stripe 账户，请访问 https://dashboard.stripe.com/ 注册"
echo "2. 获取测试环境的 API 密钥"
echo "3. 配置环境变量文件"
echo "4. 运行 'npm run dev' 启动项目"
echo ""
echo "🚀 项目验证完成！"
