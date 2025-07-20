import {
	app,
	BrowserWindow,
	Menu,
	dialog,
	ipcMain,
	shell,
	MenuItemConstructorOptions,
	IpcMainInvokeEvent,
} from "electron";
import { join } from "path";
import * as fs from "fs/promises";
import * as path from "path";

// 声明全局变量
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// 处理 Squirrel 启动事件
try {
	const squirrelStartup = require("electron-squirrel-startup");
	if (squirrelStartup) {
		app.quit();
	}
} catch (error) {
	// 如果模块不存在，忽略错误
	console.log("electron-squirrel-startup not found, continuing...");
}

const createWindow = (): void => {
	const mainWindow = new BrowserWindow({
		height: 800,
		width: 1200,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
		},
		icon: join(__dirname, "../../assets/icon.png"),
		title: "Markdown富文本编辑器",
		show: false,
	});

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	// 监听窗口关闭事件，检查未保存的修改
	mainWindow.on("close", async (event) => {
		event.preventDefault(); // 阻止默认关闭行为

		try {
			// 向渲染进程发送关闭检查请求
			mainWindow.webContents.send("request-close-check");
		} catch (error) {
			console.error("发送关闭检查请求时出错:", error);
			// 出错时为了安全起见，不关闭窗口
		}
	});

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
		);
	}

	// 创建菜单
	createMenu(mainWindow);
};

const createMenu = (mainWindow: BrowserWindow) => {
	const template: MenuItemConstructorOptions[] = [
		{
			label: "文件",
			submenu: [
				{
					label: "新建文件",
					accelerator: "CmdOrCtrl+N",
					click: () => mainWindow.webContents.send("menu-new-file"),
				},
				{
					label: "打开文件",
					accelerator: "CmdOrCtrl+O",
					click: () => mainWindow.webContents.send("menu-open-file"),
				},
				{
					label: "打开文件夹",
					accelerator: "CmdOrCtrl+Shift+O",
					click: () => mainWindow.webContents.send("menu-open-folder"),
				},
				{ type: "separator" },
				{
					label: "保存",
					accelerator: "CmdOrCtrl+S",
					click: () => mainWindow.webContents.send("menu-save"),
				},
				{
					label: "另存为",
					accelerator: "CmdOrCtrl+Shift+S",
					click: () => mainWindow.webContents.send("menu-save-as"),
				},
				{
					label: "重新加载文件",
					accelerator: "CmdOrCtrl+R",
					click: () => mainWindow.webContents.send("menu-reload-file"),
				},
				{ type: "separator" },
				{
					label: "退出",
					accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
					click: () => app.quit(),
				},
			],
		},
		{
			label: "编辑",
			submenu: [
				{ role: "undo", label: "撤销" },
				{ role: "redo", label: "重做" },
				{ type: "separator" },
				{ role: "cut", label: "剪切" },
				{ role: "copy", label: "复制" },
				{ role: "paste", label: "粘贴" },
				{ role: "selectAll", label: "全选" },
				{ type: "separator" },
				{
					label: "查找",
					accelerator: "CmdOrCtrl+F",
					click: () => mainWindow.webContents.send("menu-find"),
				},
				{
					label: "查找和替换",
					accelerator: "CmdOrCtrl+H",
					click: () => mainWindow.webContents.send("menu-find-replace"),
				},
			],
		},
		{
			label: "格式",
			submenu: [
				{
					label: "文本格式",
					submenu: [
						{
							label: "粗体",
							accelerator: "CmdOrCtrl+B",
							click: () => mainWindow.webContents.send("menu-format-bold"),
						},
						{
							label: "斜体",
							accelerator: "CmdOrCtrl+I",
							click: () => mainWindow.webContents.send("menu-format-italic"),
						},
						{
							label: "下划线",
							accelerator: "CmdOrCtrl+U",
							click: () => mainWindow.webContents.send("menu-format-underline"),
						},
						{
							label: "删除线",
							accelerator: "CmdOrCtrl+Shift+X",
							click: () => mainWindow.webContents.send("menu-format-strike"),
						},
						{
							label: "行内代码",
							accelerator: "CmdOrCtrl+`",
							click: () => mainWindow.webContents.send("menu-format-code"),
						},
					],
				},
				{
					label: "段落格式",
					submenu: [
						{
							label: "正文",
							accelerator: "CmdOrCtrl+Alt+0",
							click: () => mainWindow.webContents.send("menu-format-paragraph"),
						},
						{
							label: "标题 1",
							accelerator: "CmdOrCtrl+1",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 1),
						},
						{
							label: "标题 2",
							accelerator: "CmdOrCtrl+2",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 2),
						},
						{
							label: "标题 3",
							accelerator: "CmdOrCtrl+3",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 3),
						},
						{
							label: "标题 4",
							accelerator: "CmdOrCtrl+4",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 4),
						},
						{
							label: "标题 5",
							accelerator: "CmdOrCtrl+5",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 5),
						},
						{
							label: "标题 6",
							accelerator: "CmdOrCtrl+6",
							click: () =>
								mainWindow.webContents.send("menu-format-heading", 6),
						},
						{ type: "separator" },
						{
							label: "引用",
							accelerator: "CmdOrCtrl+Shift+.",
							click: () =>
								mainWindow.webContents.send("menu-format-blockquote"),
						},
						{
							label: "代码块",
							accelerator: "CmdOrCtrl+Shift+C",
							click: () => mainWindow.webContents.send("menu-format-codeblock"),
						},
					],
				},
				{
					label: "列表",
					submenu: [
						{
							label: "无序列表",
							accelerator: "CmdOrCtrl+Shift+8",
							click: () =>
								mainWindow.webContents.send("menu-format-bullet-list"),
						},
						{
							label: "有序列表",
							accelerator: "CmdOrCtrl+Shift+7",
							click: () =>
								mainWindow.webContents.send("menu-format-ordered-list"),
						},
						{
							label: "任务列表",
							accelerator: "CmdOrCtrl+Shift+9",
							click: () => mainWindow.webContents.send("menu-format-task-list"),
						},
					],
				},
			],
		},
		{
			label: "插入",
			submenu: [
				{
					label: "表格",
					accelerator: "CmdOrCtrl+Shift+T",
					click: () => mainWindow.webContents.send("menu-insert-table"),
				},
				{
					label: "Mermaid 图表",
					accelerator: "CmdOrCtrl+Shift+M",
					click: () => mainWindow.webContents.send("menu-insert-mermaid"),
				},
				{
					label: "分割线",
					accelerator: "CmdOrCtrl+Shift+-",
					click: () =>
						mainWindow.webContents.send("menu-insert-horizontal-rule"),
				},
				{
					label: "折叠区域",
					accelerator: "CmdOrCtrl+Shift+D",
					click: () => mainWindow.webContents.send("menu-insert-details"),
				},
			],
		},
		{
			label: "视图",
			submenu: [
				{ role: "reload", label: "重新加载" },
				{ role: "forceReload", label: "强制重新加载" },
				{ role: "toggleDevTools", label: "开发者工具" },
				{ type: "separator" },
				{
					label: "编辑模式",
					submenu: [
						{
							label: "富文本模式",
							accelerator: "CmdOrCtrl+Shift+W",
							click: () => mainWindow.webContents.send("menu-view-wysiwyg"),
						},
						{
							label: "分屏模式",
							accelerator: "CmdOrCtrl+Shift+S",
							click: () => mainWindow.webContents.send("menu-view-split"),
						},
					],
				},
				{
					label: "面板",
					submenu: [
						{
							label: "显示/隐藏大纲目录",
							accelerator: "CmdOrCtrl+Shift+O",
							click: () => mainWindow.webContents.send("menu-view-toc"),
						},
					],
				},
				{ type: "separator" },
				{
					label: "重置缩放",
					accelerator: "CmdOrCtrl+0",
					click: () => mainWindow.webContents.send("menu-zoom-reset"),
				},
				{
					label: "放大",
					accelerator: "CmdOrCtrl+Plus",
					click: () => mainWindow.webContents.send("menu-zoom-in"),
				},
				{
					label: "缩小",
					accelerator: "CmdOrCtrl+-",
					click: () => mainWindow.webContents.send("menu-zoom-out"),
				},
				{ type: "separator" },
				{ role: "togglefullscreen", label: "切换全屏" },
			],
		},
		{
			label: "工具",
			submenu: [
				{
					label: "导出",
					submenu: [
						{
							label: "导出 Markdown",
							accelerator: "CmdOrCtrl+Shift+E",
							click: () => mainWindow.webContents.send("menu-export-markdown"),
						},
						{
							label: "导出为图片",
							accelerator: "CmdOrCtrl+Shift+I",
							click: () => mainWindow.webContents.send("menu-export-image"),
						},
					],
				},
				{
					label: "转换代码块语法",
					click: () => mainWindow.webContents.send("menu-convert-codeblocks"),
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
};

// IPC 处理程序
ipcMain.handle(
	"show-open-dialog",
	async (_event: IpcMainInvokeEvent, options: any) => {
		const result = await dialog.showOpenDialog(options);
		return result;
	}
);

ipcMain.handle(
	"show-save-dialog",
	async (_event: IpcMainInvokeEvent, options: any) => {
		const result = await dialog.showSaveDialog(options);
		return result;
	}
);

ipcMain.handle(
	"read-file",
	async (_event: IpcMainInvokeEvent, filePath: string) => {
		try {
			const content = await fs.readFile(filePath, "utf-8");
			return { success: true, content };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"write-file",
	async (_event: IpcMainInvokeEvent, filePath: string, content: string) => {
		try {
			await fs.writeFile(filePath, content, "utf-8");
			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"read-directory",
	async (_event: IpcMainInvokeEvent, dirPath: string) => {
		try {
			const entries = await fs.readdir(dirPath, { withFileTypes: true });
			const items = entries.map((entry) => ({
				name: entry.name,
				path: path.join(dirPath, entry.name),
				isDirectory: entry.isDirectory(),
				isFile: entry.isFile(),
			}));
			return { success: true, items };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"create-directory",
	async (_event: IpcMainInvokeEvent, dirPath: string) => {
		try {
			await fs.mkdir(dirPath, { recursive: true });
			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"delete-file",
	async (_event: IpcMainInvokeEvent, filePath: string) => {
		try {
			const stat = await fs.stat(filePath);
			if (stat.isDirectory()) {
				await fs.rm(filePath, { recursive: true, force: true });
			} else {
				await fs.unlink(filePath);
			}
			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"rename-file",
	async (_event: IpcMainInvokeEvent, oldPath: string, newPath: string) => {
		try {
			await fs.rename(oldPath, newPath);
			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
);

ipcMain.handle(
	"show-item-in-folder",
	async (_event: IpcMainInvokeEvent, filePath: string) => {
		shell.showItemInFolder(filePath);
	}
);

// 处理渲染进程的关闭确认响应
ipcMain.handle(
	"confirm-close",
	async (_event: IpcMainInvokeEvent, canClose: boolean) => {
		const windows = BrowserWindow.getAllWindows();
		if (windows.length > 0) {
			const mainWindow = windows[0];
			if (canClose) {
				// 用户确认关闭，销毁窗口
				mainWindow.destroy();
			}
			// 如果用户取消，什么都不做，窗口保持打开
		}
		return true;
	}
);

// 处理缩放相关的IPC事件
ipcMain.handle("zoom-in", async (_event: IpcMainInvokeEvent) => {
	const windows = BrowserWindow.getAllWindows();
	if (windows.length > 0) {
		const mainWindow = windows[0];
		const currentZoom = mainWindow.webContents.getZoomLevel();
		const newZoom = Math.min(currentZoom + 0.5, 3.0); // 最大3倍缩放
		mainWindow.webContents.setZoomLevel(newZoom);
		return { success: true, zoomLevel: newZoom };
	}
	return { success: false };
});

ipcMain.handle("zoom-out", async (_event: IpcMainInvokeEvent) => {
	const windows = BrowserWindow.getAllWindows();
	if (windows.length > 0) {
		const mainWindow = windows[0];
		const currentZoom = mainWindow.webContents.getZoomLevel();
		const newZoom = Math.max(currentZoom - 0.5, -2.0); // 最小0.5倍缩放
		mainWindow.webContents.setZoomLevel(newZoom);
		return { success: true, zoomLevel: newZoom };
	}
	return { success: false };
});

ipcMain.handle("zoom-reset", async (_event: IpcMainInvokeEvent) => {
	const windows = BrowserWindow.getAllWindows();
	if (windows.length > 0) {
		const mainWindow = windows[0];
		mainWindow.webContents.setZoomLevel(0); // 重置为1倍缩放
		return { success: true, zoomLevel: 0 };
	}
	return { success: false };
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
