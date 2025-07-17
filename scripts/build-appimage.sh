#!/bin/bash

# Electron Forge AppImage 打包脚本
# 此脚本需要在 Linux 环境下运行

set -e

echo "🚀 开始构建 AppImage..."

# 检查是否在 Linux 环境
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ 错误: AppImage 打包需要在 Linux 环境下运行"
    echo "请在 Linux 系统或 Docker 容器中执行此脚本"
    exit 1
fi

# 检查必要的依赖
echo "🔍 检查系统依赖..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

# 检查 mksquashfs (AppImage 打包需要)
if ! command -v mksquashfs &> /dev/null; then
    echo "⚠️  警告: 未找到 mksquashfs，正在尝试安装..."
    
    # 尝试安装 squashfs-tools
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y squashfs-tools
    elif command -v yum &> /dev/null; then
        sudo yum install -y squashfs-tools
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y squashfs-tools
    elif command -v pacman &> /dev/null; then
        sudo pacman -S squashfs-tools
    else
        echo "❌ 错误: 无法自动安装 squashfs-tools，请手动安装"
        exit 1
    fi
fi

echo "✅ 系统依赖检查完成"

# 安装项目依赖
echo "📦 安装项目依赖..."
npm install

# 清理之前的构建
echo "🧹 清理之前的构建文件..."
rm -rf out/

# 开始打包
echo "🔨 开始打包 AppImage..."
npm run make -- --platform=linux

# 检查打包结果
if [ -d "out/make" ]; then
    echo "✅ AppImage 打包完成！"
    echo "📁 输出目录: out/make/"
    
    # 列出生成的文件
    echo "📋 生成的文件:"
    find out/make -name "*.AppImage" -type f | while read file; do
        echo "  📦 $(basename "$file")"
        echo "     大小: $(du -h "$file" | cut -f1)"
        echo "     路径: $file"
    done
    
    echo ""
    echo "🎉 AppImage 构建成功！"
    echo "💡 提示: 生成的 .AppImage 文件可以在任何 Linux 发行版上运行"
    echo "💡 使用方法: chmod +x *.AppImage && ./文件名.AppImage"
    
else
    echo "❌ 打包失败，请检查错误信息"
    exit 1
fi
