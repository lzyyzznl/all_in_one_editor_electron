# Markdown Editor Electron

一个功能强大的跨平台Markdown编辑器，基于Electron、Vue 3和TypeScript构建。

## ✨ 特性

### 📝 编辑功能
- **富文本编辑器**：基于TipTap的所见即所得Markdown编辑
- **实时预览**：支持编辑和预览模式切换
- **语法高亮**：代码块语法高亮支持
- **多标签页**：支持同时编辑多个文件
- **自动保存**：文件修改自动检测和保存提醒

### 📁 文件管理
- **文件树浏览**：直观的文件夹结构浏览
- **文件操作**：创建、删除、重命名文件和文件夹
- **文件搜索**：快速搜索文件名
- **拖拽排序**：标签页支持拖拽重新排序
- **历史记录**：记住最后打开的目录

### 🎨 界面设计
- **现代化UI**：基于Element Plus的美观界面
- **深色模式**：支持明暗主题切换
- **响应式设计**：适配不同屏幕尺寸
- **图标系统**：丰富的Iconify图标

### 🔧 技术特性
- **跨平台**：支持Windows、macOS、Linux
- **TypeScript**：完整的类型安全
- **热重载**：开发时支持热重载
- **模块化**：组件化架构设计

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd all_in_one_editor_electron

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm start
```

### 构建应用

```bash
# 构建生产版本
pnpm run make

# 打包为可分发格式
pnpm run package
```

## 📦 项目结构

```
all_in_one_editor_electron/
├── src/
│   ├── components/          # Vue组件
│   │   ├── FileBrowserApp.vue   # 主应用组件
│   │   ├── FileTree.vue         # 文件树组件
│   │   ├── MdEditor.vue         # Markdown编辑器
│   │   └── TocTree.vue          # 目录树组件
│   ├── utils/               # 工具函数
│   │   ├── file-service.ts      # 文件操作服务
│   │   ├── types.ts             # 类型定义
│   │   └── element-plus.ts      # Element Plus配置
│   ├── main.ts              # Electron主进程
│   ├── preload.ts           # 预加载脚本
│   └── renderer.ts          # 渲染进程入口
├── forge.config.js          # Electron Forge配置
├── vite.config.ts           # Vite配置
├── package.json             # 项目配置
└── README.md               # 项目说明
```

## 🛠️ 技术栈

### 核心框架
- **Electron** - 跨平台桌面应用框架
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集，提供类型安全

### UI组件库
- **Element Plus** - Vue 3组件库
- **Iconify** - 统一的图标框架
- **UnoCSS** - 原子化CSS引擎

### 编辑器
- **TipTap** - 现代富文本编辑器
- **CodeMirror** - 代码编辑器（语法高亮）

### 构建工具
- **Vite** - 快速的前端构建工具
- **Electron Forge** - Electron应用构建工具

## 📋 支持的文件格式

- `.md` - Markdown文件
- `.txt` - 纯文本文件
- `.log` - 日志文件
- `.json` - JSON文件
- `.js` - JavaScript文件
- `.ts` - TypeScript文件
- `.html` - HTML文件
- `.css` - CSS文件
- `.vue` - Vue单文件组件

## 🎯 使用说明

### 1. 选择工作目录
点击"选择目录"按钮，选择包含Markdown文件的文件夹。

### 2. 浏览文件
在左侧文件树中浏览和选择文件，支持：
- 点击文件夹展开/折叠
- 点击文件打开编辑
- 右键菜单进行文件操作

### 3. 编辑文件
- 在编辑器中直接编写Markdown
- 使用工具栏快速插入格式
- 实时预览渲染效果

### 4. 文件操作
- **新建**：右键文件夹或使用工具栏按钮
- **重命名**：右键文件选择重命名
- **删除**：右键文件选择删除
- **保存**：Ctrl+S 或自动保存

## ⚙️ 配置选项

### 主题设置
应用支持明暗主题自动切换，跟随系统设置。

### 编辑器设置
- 自动保存间隔
- 字体大小调整
- 行号显示
- 自动换行

## 🐛 故障排除

### 常见问题

**Q: 文件树不显示内容？**
A: 确保选择的目录有读取权限，并且包含支持的文件格式。

**Q: 无法保存文件？**
A: 检查文件和目录的写入权限。

**Q: 应用启动失败？**
A: 确保Node.js版本 >= 16.0.0，并重新安装依赖。

### 开发调试

```bash
# 查看详细日志
pnpm start --verbose

# 清理缓存
pnpm run clean
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [TipTap](https://tiptap.dev/) - 无头编辑器框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [Iconify](https://iconify.design/) - 图标框架

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件至：[your-email@example.com]

---

**享受使用 Markdown Editor Electron！** 🎉
