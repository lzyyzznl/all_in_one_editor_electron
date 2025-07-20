import { contextBridge, ipcRenderer } from "electron";

export interface ElectronAPI {
	showOpenDialog: (options: any) => Promise<any>;
	showSaveDialog: (options: any) => Promise<any>;
	readFile: (
		filePath: string
	) => Promise<{ success: boolean; content?: string; error?: string }>;
	writeFile: (
		filePath: string,
		content: string
	) => Promise<{ success: boolean; error?: string }>;
	readDirectory: (
		dirPath: string
	) => Promise<{ success: boolean; items?: any[]; error?: string }>;
	createDirectory: (
		dirPath: string
	) => Promise<{ success: boolean; error?: string }>;
	deleteFile: (
		filePath: string
	) => Promise<{ success: boolean; error?: string }>;
	renameFile: (
		oldPath: string,
		newPath: string
	) => Promise<{ success: boolean; error?: string }>;
	showItemInFolder: (filePath: string) => void;
	onMenuAction: (callback: (action: string, ...args: any[]) => void) => void;
	onRequestCloseCheck: (callback: () => void) => void;
	confirmClose: (canClose: boolean) => Promise<void>;
	zoomIn: () => Promise<{ success: boolean; zoomLevel?: number }>;
	zoomOut: () => Promise<{ success: boolean; zoomLevel?: number }>;
	zoomReset: () => Promise<{ success: boolean; zoomLevel?: number }>;
}

const electronAPI: ElectronAPI = {
	showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
	showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
	readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
	writeFile: (filePath, content) =>
		ipcRenderer.invoke("write-file", filePath, content),
	readDirectory: (dirPath) => ipcRenderer.invoke("read-directory", dirPath),
	createDirectory: (dirPath) => ipcRenderer.invoke("create-directory", dirPath),
	deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),
	renameFile: (oldPath, newPath) =>
		ipcRenderer.invoke("rename-file", oldPath, newPath),
	showItemInFolder: (filePath) =>
		ipcRenderer.invoke("show-item-in-folder", filePath),
	onMenuAction: (callback) => {
		// 文件菜单
		ipcRenderer.on("menu-new-file", () => callback("new-file"));
		ipcRenderer.on("menu-open-file", () => callback("open-file"));
		ipcRenderer.on("menu-open-folder", () => callback("open-folder"));
		ipcRenderer.on("menu-save", () => callback("save"));
		ipcRenderer.on("menu-save-as", () => callback("save-as"));
		ipcRenderer.on("menu-reload-file", () => callback("reload-file"));

		// 编辑菜单
		ipcRenderer.on("menu-find", () => callback("find"));
		ipcRenderer.on("menu-find-replace", () => callback("find-replace"));

		// 格式菜单 - 文本格式
		ipcRenderer.on("menu-format-bold", () => callback("format-bold"));
		ipcRenderer.on("menu-format-italic", () => callback("format-italic"));
		ipcRenderer.on("menu-format-underline", () => callback("format-underline"));
		ipcRenderer.on("menu-format-strike", () => callback("format-strike"));
		ipcRenderer.on("menu-format-code", () => callback("format-code"));

		// 格式菜单 - 段落格式
		ipcRenderer.on("menu-format-paragraph", () => callback("format-paragraph"));
		ipcRenderer.on("menu-format-heading", (event, level) =>
			callback("format-heading", level)
		);
		ipcRenderer.on("menu-format-blockquote", () =>
			callback("format-blockquote")
		);
		ipcRenderer.on("menu-format-codeblock", () => callback("format-codeblock"));

		// 格式菜单 - 列表
		ipcRenderer.on("menu-format-bullet-list", () =>
			callback("format-bullet-list")
		);
		ipcRenderer.on("menu-format-ordered-list", () =>
			callback("format-ordered-list")
		);
		ipcRenderer.on("menu-format-task-list", () => callback("format-task-list"));

		// 插入菜单
		ipcRenderer.on("menu-insert-table", () => callback("insert-table"));
		ipcRenderer.on("menu-insert-mermaid", () => callback("insert-mermaid"));
		ipcRenderer.on("menu-insert-horizontal-rule", () =>
			callback("insert-horizontal-rule")
		);
		ipcRenderer.on("menu-insert-details", () => callback("insert-details"));

		// 视图菜单
		ipcRenderer.on("menu-view-wysiwyg", () => callback("view-wysiwyg"));
		ipcRenderer.on("menu-view-split", () => callback("view-split"));
		ipcRenderer.on("menu-view-toc", () => callback("view-toc"));

		// 工具菜单
		ipcRenderer.on("menu-export-markdown", () => callback("export-markdown"));
		ipcRenderer.on("menu-export-image", () => callback("export-image"));
		ipcRenderer.on("menu-convert-codeblocks", () =>
			callback("convert-codeblocks")
		);

		// 缩放菜单
		ipcRenderer.on("menu-zoom-in", () => callback("zoom-in"));
		ipcRenderer.on("menu-zoom-out", () => callback("zoom-out"));
		ipcRenderer.on("menu-zoom-reset", () => callback("zoom-reset"));
	},
	onRequestCloseCheck: (callback) => {
		ipcRenderer.on("request-close-check", callback);
	},
	confirmClose: (canClose) => {
		return ipcRenderer.invoke("confirm-close", canClose);
	},
	zoomIn: () => ipcRenderer.invoke("zoom-in"),
	zoomOut: () => ipcRenderer.invoke("zoom-out"),
	zoomReset: () => ipcRenderer.invoke("zoom-reset"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}
