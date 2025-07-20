# Markdown富文本编辑器

现代化跨平台Markdown编辑器，基于Electron + Vue 3 + TypeScript构建。

## ✨ 核心特性

- **所见即所得编辑**：基于TipTap的富文本Markdown编辑体验
- **多标签页管理**：同时编辑多个文件，支持拖拽排序
- **智能文件树**：直观的文件夹浏览和操作
- **实时预览**：编辑与预览模式无缝切换
- **跨平台支持**：Windows、Linux

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装运行

```bash
# 安装依赖
pnpm install

# 启动应用
pnpm start

# 构建应用
pnpm run make
```

## ️ 技术栈

**核心框架**：Electron + Vue 3 + TypeScript
**编辑器**：TipTap富文本编辑器
**UI组件**：Element Plus + UnoCSS
**构建工具**：Vite + Electron Forge

## 📋 支持格式

支持 `.md` `.txt` `.json` `.js` `.ts` `.html` `.css` `.vue` 等多种文件格式

## 🎯 使用说明

1. **选择目录**：点击"选择目录"打开工作文件夹
2. **浏览文件**：左侧文件树展开/折叠，点击文件打开编辑
3. **编辑文档**：使用富文本编辑器编写，工具栏快速格式化
4. **文件操作**：右键菜单支持新建、重命名、删除等操作

## 🐛 常见问题

- **文件树不显示**：检查目录读取权限
- **无法保存文件**：检查文件写入权限
- **应用启动失败**：确保Node.js >= 16.0.0

## 📄 许可证

MIT License

---

**享受使用Markdown富文本编辑器！** 🎉
