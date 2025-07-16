import type { FileTreeNode, SupportedFileType } from "./types";

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS: SupportedFileType[] = [
	".md",
	".txt",
	".log",
	".json",
	".js",
	".ts",
	".html",
	".css",
	".vue",
];

// 检查文件是否支持编辑
export function isSupportedFile(filename: string | undefined): boolean {
	if (!filename || typeof filename !== "string") {
		return false;
	}

	const ext = filename
		.toLowerCase()
		.substring(filename.lastIndexOf(".")) as SupportedFileType;
	return SUPPORTED_EXTENSIONS.includes(ext);
}

// 获取文件扩展名
export function getFileExtension(filename: string): string {
	return filename.substring(filename.lastIndexOf(".")).toLowerCase();
}

// 获取文件名（不含扩展名）
export function getFileNameWithoutExtension(filename: string): string {
	const lastDotIndex = filename.lastIndexOf(".");
	return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

// 生成唯一ID
export function generateId(): string {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 获取文件图标类型
export function getFileIcon(filename: string): string {
	const ext = getFileExtension(filename);
	const iconMap: Record<string, string> = {
		".md": "document",
		".txt": "document",
		".log": "document",
		".json": "document",
		".js": "document",
		".ts": "document",
		".html": "document",
		".css": "document",
		".vue": "document",
	};
	return iconMap[ext] || "document";
}

// 验证文件名
export function validateFileName(name: string): {
	valid: boolean;
	message?: string;
} {
	if (!name || name.trim() === "") {
		return { valid: false, message: "文件名不能为空" };
	}

	// 检查非法字符
	const invalidChars = /[<>:"/\\|?*]/;
	if (invalidChars.test(name)) {
		return { valid: false, message: "文件名包含非法字符" };
	}

	// 检查保留名称
	const reservedNames = [
		"CON",
		"PRN",
		"AUX",
		"NUL",
		"COM1",
		"COM2",
		"COM3",
		"COM4",
		"COM5",
		"COM6",
		"COM7",
		"COM8",
		"COM9",
		"LPT1",
		"LPT2",
		"LPT3",
		"LPT4",
		"LPT5",
		"LPT6",
		"LPT7",
		"LPT8",
		"LPT9",
	];
	if (reservedNames.includes(name.toUpperCase())) {
		return { valid: false, message: "文件名为系统保留名称" };
	}

	return { valid: true };
}

// 选择根目录
export async function chooseDirectory(): Promise<string> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.showOpenDialog({
		properties: ["openDirectory"],
		title: "选择文件夹",
	});

	if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
		throw new Error("用户取消选择");
	}

	return result.filePaths[0];
}

// 读取目录内容
export async function readDirectory(dirPath: string): Promise<FileTreeNode[]> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.readDirectory(dirPath);

	if (!result.success) {
		throw new Error(result.error || "读取目录失败");
	}

	const nodes: FileTreeNode[] =
		result.items?.map((item) => ({
			id: generateId(),
			label: item.name,
			path: item.path,
			isDirectory: item.isDirectory,
			isFile: item.isFile,
			children: item.isDirectory ? [] : undefined,
		})) || [];

	// 排序：目录在前，文件在后，按名称排序
	return nodes.sort((a, b) => {
		if (a.isDirectory && !b.isDirectory) return -1;
		if (!a.isDirectory && b.isDirectory) return 1;
		return a.label.localeCompare(b.label);
	});
}

// 读取文件内容
export async function readFile(filePath: string): Promise<string> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.readFile(filePath);

	if (!result.success) {
		throw new Error(result.error || "读取文件失败");
	}

	return result.content || "";
}

// 写入文件内容
export async function writeFile(
	filePath: string,
	content: string
): Promise<void> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.writeFile(filePath, content);

	if (!result.success) {
		throw new Error(result.error || "写入文件失败");
	}
}

// 创建文件
export async function createFile(
	filePath: string,
	content: string = ""
): Promise<void> {
	await writeFile(filePath, content);
}

// 创建目录
export async function createDirectory(dirPath: string): Promise<void> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.createDirectory(dirPath);

	if (!result.success) {
		throw new Error(result.error || "创建目录失败");
	}
}

// 删除文件
export async function deleteFile(filePath: string): Promise<void> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.deleteFile(filePath);

	if (!result.success) {
		throw new Error(result.error || "删除文件失败");
	}
}

// 删除目录
export async function deleteDirectory(dirPath: string): Promise<void> {
	await deleteFile(dirPath); // 使用同一个API
}

// 重命名文件/目录
export async function renameFile(
	oldPath: string,
	newPath: string
): Promise<void> {
	if (typeof window === "undefined" || !window.electronAPI) {
		throw new Error("Electron API not available");
	}

	const result = await window.electronAPI.renameFile(oldPath, newPath);

	if (!result.success) {
		throw new Error(result.error || "重命名失败");
	}
}

// 检查文件/目录是否存在
export async function exists(filePath: string): Promise<boolean> {
	try {
		await readFile(filePath);
		return true;
	} catch {
		try {
			await readDirectory(filePath);
			return true;
		} catch {
			return false;
		}
	}
}

// 检查是否为目录
export async function isDirectory(filePath: string): Promise<boolean> {
	try {
		await readDirectory(filePath);
		return true;
	} catch {
		return false;
	}
}

// 获取文件类型（用于编辑器语言模式）
export function getFileType(filename: string): string {
	const ext = getFileExtension(filename).toLowerCase();
	const typeMap: Record<string, string> = {
		".md": "markdown",
		".txt": "text",
		".log": "text",
		".json": "json",
		".js": "javascript",
		".ts": "typescript",
		".html": "html",
		".css": "css",
		".vue": "vue",
	};
	return typeMap[ext] || "text";
}
