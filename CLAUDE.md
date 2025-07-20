# CLAUDE.md - 项目指南

这个文件为Claude Code提供项目特定的指导和上下文信息。

## 项目概述

**Markdown富文本编辑器** - 基于Electron + Vue 3 + TypeScript构建的现代化跨平台Markdown编辑器。

## 技术栈

- **核心框架**: Electron 27 + Vue 3.3 + TypeScript 5.2
- **编辑器**: TipTap 2.x 富文本编辑器（支持Markdown）
- **UI组件**: Element Plus + UnoCSS（原子化CSS）
- **构建工具**: Vite 5 + Electron Forge 7
- **包管理器**: pnpm

## 项目结构

```
src/
├── main.ts                 # Electron主进程（窗口管理、IPC通信）
├── preload.ts             # 预加载脚本（安全IPC桥接）
├── renderer.ts            # Vue应用初始化入口
├── App.vue                # 根Vue组件
├── components/            # Vue组件目录
│   ├── FileBrowserApp.vue # 主应用布局（侧边栏+编辑器）
│   ├── FileTree.vue       # 文件树导航组件
│   ├── MdEditor.vue       # Markdown编辑器（基于TipTap）
│   └── TocTree.vue        # 目录树组件
└── utils/
    ├── file-service-electron.ts  # 文件操作封装（通过Electron IPC）
    ├── types.ts           # TypeScript类型定义
    └── element-plus.ts    # Element Plus配置
```

## 核心功能模块

### 1. 文件管理
- 支持多种文件格式：.md, .txt, .json, .js, .ts, .html, .css, .vue
- 文件树导航（展开/折叠、新建、重命名、删除）
- 多标签页编辑
- 文件修改状态追踪

### 2. 编辑器功能
- 基于TipTap的所见即所得编辑
- 实时Markdown预览
- 工具栏格式化选项
- 代码语法高亮
- 字符计数
- 目录生成

### 3. 主题系统
- 明暗主题切换
- UnoCSS原子化样式
- Element Plus组件主题

## IPC通信机制

### 主进程API
主进程（main.ts）通过IPC暴露以下功能：
- `showOpenDialog` - 显示打开文件对话框
- `showSaveDialog` - 显示保存文件对话框
- `readFile` - 读取文件内容
- `writeFile` - 写入文件内容
- `readDirectory` - 读取目录结构
- `createDirectory` - 创建目录
- `deleteFile` - 删除文件/目录
- `renameFile` - 重命名文件/目录
- `showItemInFolder` - 在系统文件管理器中显示文件

### 安全通信
- 预加载脚本（preload.ts）提供`window.electronAPI`安全桥接
- 上下文隔离启用
- 仅暴露必要的API接口

## 开发命令

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 常用命令
```bash
# 依赖安装
pnpm install

# 开发模式（热重载）
pnpm start

# 代码质量检查
pnpm run lint

# 构建生产版本
pnpm run make          # 构建可执行文件
pnpm run package       # 打包分发版本
pnpm run make:appimage # Linux AppImage构建
```

## 配置说明

### 构建配置
- **forge.config.js**: Electron Forge构建配置
- **vite.renderer.config.ts**: 渲染进程Vite配置
- **vite.main.config.ts**: 主进程Vite配置
- **uno.config.ts**: UnoCSS原子化CSS配置
- **tsconfig.json**: TypeScript配置

### 样式系统
- UnoCSS原子化CSS（支持dark:变体）
- Element Plus组件样式
- 自定义CSS变量（主题切换）

## 编码规范

### 文件命名
- Vue组件：PascalCase（如FileTree.vue）
- TypeScript文件：camelCase（如fileService.ts）
- 工具函数：camelCase

### 代码风格
- TypeScript严格模式启用
- 使用Composition API
- 响应式状态使用ref/reactive
- 异步操作使用async/await

### 类型定义
- 统一在types.ts中定义接口
- 文件系统相关类型：FileTreeNode, FileContent
- IPC通信类型：严格类型检查

## 调试提示

### 主进程调试
- 使用Chrome DevTools调试主进程
- 日志输出：console.log在主进程终端显示

### 渲染进程调试
- 使用Electron内置DevTools
- Vue DevTools支持

### 常见问题
- 文件树不显示：检查目录读取权限
- 无法保存文件：检查文件写入权限
- 应用启动失败：确认Node.js版本>=16.0.0

## 扩展开发

### 添加新文件类型支持
1. 在file-service-electron.ts中添加文件类型检测
2. 在MdEditor.vue中添加对应的编辑器处理
3. 更新文件图标和语法高亮

### 添加新功能
1. 遵循Vue 3 Composition API模式
2. 使用TypeScript严格类型
3. 通过IPC与主进程通信
4. 遵循现有的错误处理模式

## 部署说明

### 支持平台
- Windows (.exe via Squirrel.Windows)
- macOS (.zip, .dmg)
- Linux (.deb, .rpm, .AppImage)

### 构建输出
- 构建产物在`out/`目录
- 各平台安装包在`out/make/`目录