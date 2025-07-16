# 更新日志

本文档记录了项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 初始版本发布
- 基于 TipTap 的富文本 Markdown 编辑器
- 文件树浏览和管理功能
- 多标签页支持
- 文件创建、删除、重命名功能
- 文件搜索功能
- 拖拽排序标签页
- 深色模式支持
- 跨平台支持 (Windows, macOS, Linux)

### 技术特性
- Electron + Vue 3 + TypeScript 架构
- Element Plus UI 组件库
- UnoCSS 原子化 CSS
- Vite 构建工具
- Electron Forge 打包工具

## [1.0.0] - 2024-07-16

### 新增
- 项目初始化
- 从 WXT 浏览器插件迁移到 Electron 桌面应用
- 完整的文件系统操作支持
- 现代化的用户界面设计

### 修复
- 修复了 vuedraggable Vue 3 兼容性问题
- 修复了文件树数据加载问题
- 修复了 Electron API 调用错误
- 修复了模板引用错误

### 变更
- 将文件操作从浏览器 File System Access API 迁移到 Electron 文件系统 API
- 更新了所有组件以适配 Electron 环境
- 优化了文件树渲染性能

---

## 版本说明

### 版本号格式
- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 变更类型
- **新增**：新功能
- **变更**：对现有功能的变更
- **弃用**：即将移除的功能
- **移除**：已移除的功能
- **修复**：问题修复
- **安全**：安全相关的修复
