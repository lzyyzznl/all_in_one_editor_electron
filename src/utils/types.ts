// 文件树节点 - 适配Electron环境
export interface FileTreeNode {
	id: string;
	label: string;
	path: string; // 使用文件路径而不是handle
	isDirectory: boolean;
	isFile: boolean;
	children?: FileTreeNode[];
}

// 文件内容
export interface FileContent {
	path: string; // 文件路径
	content: string;
	modified: boolean;
}

// 支持的文件类型
export type SupportedFileType =
	| ".md"
	| ".txt"
	| ".log"
	| ".json"
	| ".js"
	| ".ts"
	| ".html"
	| ".css"
	| ".vue";

// 文件浏览器状态
export interface FileBrowserState {
	rootPath: string | null; // 根目录路径
	selectedNode: FileTreeNode | null;
	openFiles: Map<string, FileContent>;
	currentFile: FileContent | null;
	isLoading: boolean;
}

// 通知类型
export interface NotificationOptions {
	title: string;
	message?: string;
	type?: "success" | "warning" | "error" | "info";
	duration?: number;
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

// 主题类型
export type Theme = "light" | "dark" | "auto";


