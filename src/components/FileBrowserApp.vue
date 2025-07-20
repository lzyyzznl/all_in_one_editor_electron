<template>
	<!-- 加载状态 -->
	<div
		v-if="isInitializing"
		class="h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center"
	>
		<div class="text-center">
			<div class="relative mb-8">
				<div
					class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse"
				>
					<el-icon class="text-white text-3xl"><FolderOpened /></el-icon>
				</div>
				<div
					class="absolute inset-0 w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-2xl animate-spin mx-auto"
					style="border-top-color: transparent"
				></div>
			</div>
			<p
				class="text-slate-900 dark:text-slate-100 font-bold text-2xl mb-3 flex items-center justify-center gap-2"
			>
				<el-icon><FolderOpened /></el-icon>
				正在初始化文件浏览器...
			</p>
			<p class="text-slate-600 dark:text-slate-400 text-base">
				请稍候，即将展现精彩内容
			</p>
		</div>
	</div>

	<!-- 主应用 -->
	<div v-else class="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
		<!-- 主要内容区 -->
		<div class="flex-1 flex overflow-hidden">
			<!-- 左侧文件树 -->
			<div
				class="bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-hidden shadow-lg transition-all duration-300 ease-in-out relative"
				:style="{ width: (isCollapsed ? 50 : sidebarWidth) + 'px' }"
			>
				<!-- 折叠按钮 -->
				<div
					class="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 transition-all duration-300"
					style="right: 0"
				>
					<el-button
						@click="toggleCollapse"
						size="small"
						:title="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
						class="!p-1 !w-6 !h-6 !rounded-md !bg-slate-100 dark:!bg-slate-700 !border-slate-200 dark:!border-slate-600 !text-slate-600 dark:!text-slate-400 hover:!bg-slate-200 dark:hover:!bg-slate-600 hover:!text-slate-700 dark:hover:!text-slate-300 !shadow-sm transition-all duration-200"
					>
						<Icon
							:icon="
								isCollapsed
									? 'material-symbols:chevron-right'
									: 'material-symbols:chevron-left'
							"
							class="w-4 h-4"
						/>
					</el-button>
				</div>

				<!-- 文件树容器 -->
				<div
					class="h-full transition-all duration-300 ease-in-out"
					:class="{ 'opacity-0 pointer-events-none': isCollapsed }"
				>
					<FileTree
						ref="fileTreeRef"
						v-model="rootDirectoryPath"
						@select-file="handleSelectFile"
						@select-directory="handleSelectDirectory"
						@file-deleted="handleFileDeleted"
						@file-updated="handleFileUpdated"
					/>
				</div>

				<!-- 折叠状态下的图标 -->
				<div
					v-if="isCollapsed"
					class="h-full flex flex-col items-center justify-start pt-16 gap-4"
				>
					<div
						class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
					>
						<el-icon class="text-white text-lg"><FolderOpened /></el-icon>
					</div>
					<div
						class="text-xs text-slate-500 dark:text-slate-400 transform rotate-90"
						style="writing-mode: vertical-rl"
					>
						文件
					</div>
				</div>
			</div>

			<!-- 拖拽分割线 -->
			<div
				class="w-1 bg-slate-200 dark:bg-slate-700 cursor-col-resize hover:bg-gradient-to-b hover:from-blue-400 hover:to-purple-400 transition-all duration-300 hover:w-2 relative group"
				@mousedown="startResize"
				:class="{
					'bg-gradient-to-b from-blue-400 to-purple-400 w-2': isResizing,
				}"
			>
				<div
					class="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-white dark:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
				></div>
			</div>

			<!-- 右侧编辑器区域 -->
			<div
				class="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-800"
			>
				<!-- 页签栏 -->
				<div
					class="flex items-end bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-600 min-h-14 flex-shrink-0 shadow-sm"
				>
					<div
						class="flex items-end overflow-x-auto scrollbar-hide px-2 flex-1"
					>
						<VueDraggable
							v-if="openTabs.length > 0"
							v-model="openTabs"
							item-key="id"
							class="flex items-end"
							:animation="200"
							ghost-class="opacity-50"
							chosen-class="shadow-lg"
							@start="onDragStart"
							@end="onDragEnd"
						>
							<template #item="{ element: tab }">
								<div
									class="relative flex items-center gap-3 px-4 py-2 cursor-pointer transition-all duration-200 min-w-0 group h-9 max-w-60 min-w-[120px] -mr-3 rounded-t-xl overflow-visible border-t border-l border-r"
									:class="{
										'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 shadow-lg z-10':
											activeTabId === tab.id,
										'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 shadow-sm z-[1] hover:bg-gray-50 dark:hover:bg-gray-600':
											activeTabId !== tab.id,
									}"
									@click="switchToTab(tab.id)"
									@contextmenu="showContextMenu($event, tab.id)"
								>
									<div
										class="w-4 h-4 flex items-center justify-center flex-shrink-0 mr-2"
									>
										<Icon
											:icon="
												tab.isVirtual
													? 'material-symbols:note-add'
													: 'material-symbols:description'
											"
											class="w-4 h-4"
										/>
									</div>

									<div class="flex-1 min-w-0 flex items-center gap-2">
										<span
											class="text-base font-semibold truncate flex-1"
											:title="tab.filePath || tab.title"
										>
											{{ getTabDisplayTitle(tab) }}
										</span>
										<div
											v-if="tab.isModified"
											class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
											title="已修改"
										></div>
									</div>

									<div
										class="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/10 dark:hover:bg-white/10 rounded cursor-pointer"
										@click.stop="closeTab(tab.id)"
										title="关闭"
									>
										<Icon icon="material-symbols:close" class="w-3 h-3" />
									</div>
								</div>
							</template>
						</VueDraggable>

						<!-- 新建标签页按钮 -->
						<div class="flex items-center ml-4">
							<el-button
								@click="createNewTab"
								size="small"
								title="新建标签页"
								class="!w-7 !h-7 !rounded-md !bg-slate-100 dark:!bg-slate-700 !border-slate-200 dark:!border-slate-600 !text-slate-600 dark:!text-slate-400 hover:!bg-slate-50 dark:hover:!bg-slate-600 !font-medium !shadow-sm hover:!shadow-md !transition-all !duration-200 !mb-2"
							>
								<Icon icon="material-symbols:add" class="text-sm" />
							</el-button>
						</div>
					</div>
				</div>

				<!-- 标签页右键菜单 -->
				<div
					v-if="contextMenuVisible"
					class="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-48 z-50"
					:style="{
						left: contextMenuPosition.x + 'px',
						top: contextMenuPosition.y + 'px',
					}"
					@click.stop
				>
					<div
						class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
						:class="{
							'text-gray-400 dark:text-gray-600 cursor-not-allowed':
								!contextMenuTabId ||
								openTabs.findIndex((t) => t.id === contextMenuTabId) <= 0,
						}"
						@click="
							!(
								!contextMenuTabId ||
								openTabs.findIndex((t) => t.id === contextMenuTabId) <= 0
							) && closeTabsToLeft(contextMenuTabId!)
						"
					>
						<Icon icon="material-symbols:arrow-back" class="w-4 h-4" />
						关闭左侧标签页
					</div>
					<div
						class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
						:class="{
							'text-gray-400 dark:text-gray-600 cursor-not-allowed':
								!contextMenuTabId ||
								openTabs.findIndex((t) => t.id === contextMenuTabId) >=
									openTabs.length - 1,
						}"
						@click="
							!(
								!contextMenuTabId ||
								openTabs.findIndex((t) => t.id === contextMenuTabId) >=
									openTabs.length - 1
							) && closeTabsToRight(contextMenuTabId!)
						"
					>
						<Icon icon="material-symbols:arrow-forward" class="w-4 h-4" />
						关闭右侧标签页
					</div>
					<div
						class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
						:class="{
							'text-gray-400 dark:text-gray-600 cursor-not-allowed':
								!contextMenuTabId || openTabs.length <= 1,
						}"
						@click="
							!(!contextMenuTabId || openTabs.length <= 1) &&
							closeOtherTabs(contextMenuTabId!)
						"
					>
						<Icon icon="material-symbols:remove" class="w-4 h-4" />
						关闭其他标签页
					</div>
					<div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
					<div
						class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
						@click="closeAllTabs()"
					>
						<Icon icon="material-symbols:close" class="w-4 h-4" />
						关闭所有标签页
					</div>
				</div>

				<!-- 编辑器内容 -->
				<div class="flex-1 overflow-hidden">
					<MdEditor
						ref="mdEditorRef"
						:file-path="currentFilePath"
						:file-node="currentFileNode"
						:tab-count="openTabs.length"
						:is-virtual="getCurrentTabIsVirtual()"
						:virtual-tab-id="getCurrentVirtualTabId()"
						@file-modified="handleFileModified"
						@file-saved="handleFileSaved"
						@save-as-requested="handleSaveAsRequested"
						@open-file-requested="handleOpenFileRequested"
						@open-folder-requested="handleOpenFolderRequested"
						@new-tab-requested="handleNewTabRequested"
						@clear-cache-requested="handleClearCacheRequested"
					/>
				</div>
			</div>
		</div>

		<!-- 另存为对话框 -->
		<el-dialog
			v-model="showSaveAsDialog"
			width="420px"
			draggable
			@close="resetSaveAsDialog"
			class="[&_.el-dialog]:rounded-2xl [&_.el-dialog]:shadow-2xl [&_.el-dialog__header]:bg-gradient-to-135deg [&_.el-dialog__header]:from-slate-50 [&_.el-dialog__header]:to-slate-200 [&_.el-dialog__header]:rounded-t-2xl [&_.el-dialog__header]:p-6 [&_.el-dialog__header]:border-b [&_.el-dialog__header]:border-slate-200 [&_.el-dialog__title]:font-semibold [&_.el-dialog__title]:text-slate-800"
		>
			<template #header>
				<div class="flex items-center gap-2">
					<Icon icon="material-symbols:save-as" />
					另存为文件
				</div>
			</template>
			<el-form :model="saveAsForm" label-width="90px" class="p-2">
				<el-form-item class="mb-6">
					<template #label>
						<div class="flex items-center gap-2">
							<Icon icon="material-symbols:folder-open" />
							保存位置
						</div>
					</template>
					<div class="flex gap-2">
						<el-input
							v-model="saveAsForm.targetPath"
							placeholder="选择保存目录..."
							readonly
							size="large"
							class="flex-1 !rounded-xl [&_.el-input__wrapper]:rounded-xl [&_.el-input__wrapper]:shadow-sm"
						/>
						<el-button
							@click="selectSaveDirectory"
							size="large"
							class="!rounded-xl !px-4"
						>
							<Icon icon="material-symbols:folder-open" class="mr-1" />
							选择
						</el-button>
					</div>
				</el-form-item>
				<el-form-item class="mb-6">
					<template #label>
						<div class="flex items-center gap-2">
							<Icon icon="material-symbols:edit" />
							文件名
						</div>
					</template>
					<el-input
						v-model="saveAsForm.fileName"
						placeholder="输入文件名..."
						autofocus
						@keyup.enter="saveAsFile"
						size="large"
						class="!rounded-xl [&_.el-input__wrapper]:rounded-xl [&_.el-input__wrapper]:shadow-sm [&_.el-input__wrapper]:transition-all [&_.el-input__wrapper]:duration-200 [&_.el-input__wrapper:hover]:shadow-md [&_.el-input__wrapper.is-focus]:shadow-blue-100 [&_.el-input__wrapper.is-focus]:ring-3 [&_.el-input__wrapper.is-focus]:ring-blue-100"
					/>
				</el-form-item>
				<el-form-item class="mb-4">
					<template #label>
						<div class="flex items-center gap-2">
							<Icon icon="material-symbols:folder-open" />
							类型
						</div>
					</template>
					<el-select
						v-model="saveAsForm.fileType"
						placeholder="选择文件类型"
						class="w-full"
						size="large"
					>
						<el-option value="md">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:edit-note" />
								Markdown文件 (.md)
							</div>
						</el-option>
						<el-option value="txt">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:description" />
								文本文件 (.txt)
							</div>
						</el-option>
						<el-option value="json">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:data-object" />
								JSON文件 (.json)
							</div>
						</el-option>
						<el-option value="js">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:code" />
								JavaScript文件 (.js)
							</div>
						</el-option>
						<el-option value="ts">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:code" />
								TypeScript文件 (.ts)
							</div>
						</el-option>
						<el-option value="vue">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:code" />
								Vue文件 (.vue)
							</div>
						</el-option>
						<el-option value="html">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:description" />
								HTML文件 (.html)
							</div>
						</el-option>
						<el-option value="css">
							<div class="flex items-center gap-2">
								<Icon icon="material-symbols:description" />
								CSS文件 (.css)
							</div>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="flex justify-end gap-3 p-2">
					<el-button
						@click="resetSaveAsDialog"
						size="large"
						class="!rounded-xl"
					>
						取消
					</el-button>
					<el-button
						@click="saveAsFile"
						type="primary"
						size="large"
						class="!rounded-xl !bg-gradient-to-r !from-blue-600 !to-purple-600 !border-none"
					>
						<div class="flex items-center gap-2">
							<Icon icon="material-symbols:save-as" />
							保存
						</div>
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 文件夹选择器对话框 -->
		<el-dialog
			v-model="showFolderSelector"
			width="400px"
			draggable
			@close="showFolderSelector = false"
			class="[&_.el-dialog]:rounded-2xl [&_.el-dialog]:shadow-2xl"
		>
			<template #header>
				<div class="flex items-center gap-2">
					<Icon icon="material-symbols:folder-open" />
					选择保存文件夹
				</div>
			</template>
			<div class="max-h-96 overflow-y-auto">
				<el-tree
					:data="folderTreeData"
					:props="{ children: 'children', label: 'label' }"
					node-key="id"
					default-expand-all
					:expand-on-click-node="false"
					@node-click="confirmFolderSelection"
					class="folder-tree"
				>
					<template #default="{ node, data }">
						<div
							class="flex items-center gap-2 py-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded px-2 w-full"
						>
							<Icon icon="material-symbols:folder" class="text-blue-500" />
							<span>{{ data.label }}</span>
						</div>
					</template>
				</el-tree>
			</div>
			<template #footer>
				<div class="flex justify-end">
					<el-button @click="showFolderSelector = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped>
.folder-tree :deep(.el-tree-node__content) {
	height: auto;
	padding: 4px 0;
}

.folder-tree :deep(.el-tree-node__content:hover) {
	background-color: transparent;
}

.folder-tree :deep(.el-tree-node__expand-icon) {
	color: #6b7280;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { ElMessageBox, ElNotification } from "element-plus";
import VueDraggable from "vuedraggable";
import FileTree from "./FileTree.vue";
import MdEditor from "./MdEditor.vue";
import { chooseDirectory, readDirectory } from "../utils/file-service";
import type { FileTreeNode } from "../utils/types";

// 页面标题
document.title = "文件浏览器";

// 组件引用
const fileTreeRef = ref<InstanceType<typeof FileTree> | null>(null);
const mdEditorRef = ref<InstanceType<typeof MdEditor> | null>(null);

// 响应式数据
const rootDirectoryPath = ref<string | null>(null);
const currentFilePath = ref<string | null>(null);
const currentFileNode = ref<FileTreeNode | null>(null);
const fileModified = ref(false);
const isInitializing = ref(true);

// 文件统计相关
const fileSize = ref(0);
const modifiedContent = ref("");

// 文件内容缓存接口
interface FileCache {
	content: string; // 当前内容
	originalContent: string; // 原始文件内容
	isModified: boolean; // 是否已修改
	lastModified: number; // 最后修改时间
	lastAccessed: number; // 最后访问时间
}

// 页签相关数据
interface TabItem {
	id: string;
	filePath: string | null;
	fileNode: FileTreeNode | null;
	isModified: boolean;
	title: string;
	fullPath?: string;
	modifiedContent?: string;
	lastSaveTime?: number;
	isVirtual?: boolean;
	virtualContent?: string;
}

const openTabs = ref<TabItem[]>([]);
const activeTabId = ref<string | null>(null);

// 虚拟标签页计数器
const virtualTabCounter = ref(1);

// 文件内容缓存
const fileContentCache = ref<Map<string, FileCache>>(new Map());

// 缓存管理函数
const getCacheKey = (tab: TabItem): string => {
	if (tab.isVirtual) {
		return `virtual:${tab.id}`;
	} else if (tab.filePath) {
		return `file:${tab.filePath}`;
	} else {
		return `file:${tab.title}`;
	}
};

const getCacheContent = (cacheKey: string): FileCache | null => {
	return fileContentCache.value.get(cacheKey) || null;
};

const setCacheContent = (cacheKey: string, cache: FileCache): void => {
	cache.lastAccessed = Date.now();
	fileContentCache.value.set(cacheKey, cache);
	console.log("设置缓存内容:", {
		cacheKey,
		contentLength: cache.content.length,
		isModified: cache.isModified,
	});
};

const clearCacheContent = (cacheKey: string): void => {
	fileContentCache.value.delete(cacheKey);
	console.log("清除缓存内容:", cacheKey);
};

const clearAllCache = (): void => {
	fileContentCache.value.clear();
	console.log("清除所有缓存");
};

// 另存为对话框相关
const showSaveAsDialog = ref(false);
const saveAsContent = ref("");
const saveAsForm = ref({
	fileName: "",
	fileType: "md",
	targetDirectory: null as string | null,
	targetPath: "",
});

// 右键菜单相关
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuTabId = ref<string | null>(null);

// 拖拽相关
const isDragging = ref(false);

// 布局相关
const sidebarWidth = ref(300);
const editorWidth = computed(() => window.innerWidth - sidebarWidth.value - 20);
const isResizing = ref(false);
const isCollapsed = ref(false);

// 计算属性
const apiSupported = computed(
	() => typeof window !== "undefined" && window.electronAPI
);

// 页签持久化相关
const TAB_DB_NAME = "file-browser-tabs-db";
const TAB_DB_VERSION = 1;
const TAB_STORE_NAME = "open-tabs";

// 初始化页签数据库
const initTabDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(TAB_DB_NAME, TAB_DB_VERSION);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(TAB_STORE_NAME)) {
				db.createObjectStore(TAB_STORE_NAME, { keyPath: "id" });
			}
		};
	});
};

// 获取文件的相对路径
const getFileRelativePath = async (
	filePath: string,
	rootPath: string,
	node?: FileTreeNode
): Promise<string> => {
	try {
		// 如果有 FileTreeNode，直接使用其 path 字段
		if (node && node.path) {
			return node.path.replace(rootPath, "").replace(/^[\/\\]/, "");
		}
		// 降级到相对路径计算
		return filePath.replace(rootPath, "").replace(/^[\/\\]/, "");
	} catch (error) {
		console.warn("无法获取文件相对路径:", error);
		return filePath.split(/[\/\\]/).pop() || filePath;
	}
};

// 保存页签状态
const saveTabsState = async () => {
	console.log("页签状态保存已禁用（避免 DataCloneError）");
	return;
};

// 加载页签状态
const loadTabsState = async (): Promise<boolean> => {
	console.log("页签状态加载已禁用（避免 DataCloneError）");
	return false;
};

// 计算标签页的显示标题（处理同名文件）
const getTabDisplayTitle = (tab: TabItem): string => {
	const fileName = tab.title;

	// 查找所有同名文件的标签页
	const sameNameTabs = openTabs.value.filter((t) => t.title === fileName);

	// 如果只有一个同名文件，直接返回文件名
	if (sameNameTabs.length <= 1) {
		return fileName;
	}

	// 如果有多个同名文件，需要添加目录前缀来区分
	const filePath = tab.filePath || fileName;
	const pathParts = filePath.split("/");

	// 如果路径只有文件名，直接返回
	if (pathParts.length <= 1) {
		return fileName;
	}

	// 计算最小必要的路径前缀来区分同名文件
	const otherSameNameTabs = sameNameTabs.filter((t) => t.id !== tab.id);
	let prefixLength = 1;

	// 找到能够区分所有同名文件的最短前缀
	while (prefixLength < pathParts.length - 1) {
		const currentPrefix = pathParts.slice(-prefixLength - 1, -1).join("/");
		const currentDisplayTitle = `${currentPrefix}/${fileName}`;

		// 检查这个前缀是否能区分其他同名文件
		const conflicts = otherSameNameTabs.filter((otherTab) => {
			const otherPath = otherTab.filePath || otherTab.title;
			const otherParts = otherPath.split("/");
			if (otherParts.length <= prefixLength) return false;

			const otherPrefix = otherParts.slice(-prefixLength - 1, -1).join("/");
			return otherPrefix === currentPrefix;
		});

		// 如果没有冲突，使用当前前缀
		if (conflicts.length === 0) {
			return currentDisplayTitle;
		}

		prefixLength++;
	}

	// 如果仍有冲突，使用完整路径（去掉文件名）
	const fullPrefix = pathParts.slice(0, -1).join("/");
	return fullPrefix ? `${fullPrefix}/${fileName}` : fileName;
};

// 处理文件选择
const handleSelectFile = async (filePath: string, node: FileTreeNode) => {
	console.log("处理文件选择:", {
		filePath: filePath,
		nodeLabel: node.label,
		hasFilePath: !!filePath,
	});

	// 获取文件的完整相对路径
	const relativePath = rootDirectoryPath.value
		? await getFileRelativePath(filePath, rootDirectoryPath.value, node)
		: node.label;

	// 使用完整路径判断是否为同一个标签页
	const existingTab = openTabs.value.find((tab) => tab.fullPath === filePath);
	if (existingTab) {
		switchToTab(existingTab.id);
	} else {
		const newTab: TabItem = {
			id: `tab-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
			filePath: filePath,
			fileNode: node,
			isModified: false,
			title: node.label,
			fullPath: filePath,
			lastSaveTime: Date.now(),
		};

		openTabs.value.push(newTab);
		switchToTab(newTab.id);
		await saveTabsState();
	}

	console.log("currentFilePath已设置:", currentFilePath.value);
	console.log("currentFileNode已设置:", currentFileNode.value?.label);
};

// 创建新的虚拟标签页
const createNewTab = () => {
	const newTab: TabItem = {
		id: `virtual-tab-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
		fileHandle: null,
		fileNode: null,
		isModified: false,
		title: `新建标签${virtualTabCounter.value}`,
		isVirtual: true,
		virtualContent: "",
		lastSaveTime: Date.now(),
	};

	openTabs.value.push(newTab);
	switchToTab(newTab.id);
	virtualTabCounter.value++;

	console.log("创建虚拟标签页:", {
		tabId: newTab.id,
		title: newTab.title,
		isVirtual: newTab.isVirtual,
	});
};

// 处理打开文件请求（从欢迎界面）
const handleOpenFileRequested = async () => {
	try {
		// 使用Electron API打开文件
		const result = await window.electronAPI.showOpenDialog({
			properties: ["openFile"],
			title: "打开文件",
			filters: [
				{ name: "Markdown文件", extensions: ["md", "markdown"] },
				{ name: "文本文件", extensions: ["txt"] },
				{ name: "JSON文件", extensions: ["json"] },
				{ name: "JavaScript文件", extensions: ["js"] },
				{ name: "TypeScript文件", extensions: ["ts"] },
				{ name: "Vue文件", extensions: ["vue"] },
				{ name: "HTML文件", extensions: ["html"] },
				{ name: "CSS文件", extensions: ["css"] },
				{ name: "所有文件", extensions: ["*"] },
			],
		});

		if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
			const filePath = result.filePaths[0];
			console.log("打开文件:", filePath);

			// 创建一个临时的文件节点，不再提示选择目录
			const fileName = filePath.split(/[\/\\]/).pop() || filePath;
			const tempNode: FileTreeNode = {
				id: `file-${Date.now()}`,
				label: fileName,
				path: filePath,
				isDirectory: false,
				isFile: true,
			};

			// 打开文件，不自动填充目录树
			await handleSelectFile(filePath, tempNode);
		}
	} catch (error: any) {
		console.error("打开文件失败:", error);
		ElNotification({
			title: "打开文件失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	}
};

// 处理打开文件夹请求（从欢迎界面）
const handleOpenFolderRequested = async () => {
	try {
		// 使用Electron API打开文件夹
		const result = await window.electronAPI.showOpenDialog({
			properties: ["openDirectory"],
			title: "选择文件夹",
		});

		if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
			const folderPath = result.filePaths[0];
			console.log("打开文件夹:", folderPath);

			// 设置根目录路径，触发文件树加载
			rootDirectoryPath.value = folderPath;

			// 通知用户文件夹已打开
			ElNotification({
				title: "文件夹已打开",
				message: `已打开文件夹: ${folderPath.split(/[\/\\]/).pop()}`,
				type: "success",
				position: "bottom-right",
				duration: 3000,
				offset: 50,
			});
		}
	} catch (error: any) {
		console.error("打开文件夹失败:", error);
		ElNotification({
			title: "打开文件夹失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	}
};

// 处理新建标签页请求（从欢迎界面）
const handleNewTabRequested = () => {
	createNewTab();
};

// 处理清除缓存请求
const handleClearCacheRequested = () => {
	if (activeTabId.value) {
		const tab = openTabs.value.find((t) => t.id === activeTabId.value);
		if (tab) {
			const cacheKey = getCacheKey(tab);
			clearCacheContent(cacheKey);
			console.log("清除当前标签页缓存:", cacheKey);
		}
	}
};

// 切换到指定页签
const switchToTab = (tabId: string) => {
	const tab = openTabs.value.find((t) => t.id === tabId);
	if (!tab) {
		console.error("找不到页签:", tabId);
		return;
	}

	// 先保存当前页签的内容到缓存
	if (activeTabId.value && mdEditorRef.value) {
		const currentTab = openTabs.value.find((t) => t.id === activeTabId.value);
		if (currentTab) {
			const currentContent = mdEditorRef.value.getCurrentContent?.() || "";
			const currentCacheKey = getCacheKey(currentTab);

			// 更新缓存
			const existingCache = getCacheContent(currentCacheKey);
			if (existingCache) {
				existingCache.content = currentContent;
				existingCache.isModified = currentTab.isModified;
				existingCache.lastModified = Date.now();
				setCacheContent(currentCacheKey, existingCache);
			} else if (currentContent) {
				// 创建新的缓存条目
				setCacheContent(currentCacheKey, {
					content: currentContent,
					originalContent: currentContent,
					isModified: currentTab.isModified,
					lastModified: Date.now(),
					lastAccessed: Date.now(),
				});
			}
		}
	}

	// 切换到新页签
	activeTabId.value = tabId;
	fileModified.value = tab.isModified;
	currentFilePath.value = tab.filePath;
	currentFileNode.value = tab.fileNode;

	console.log("切换到页签:", {
		tabId,
		fileHandleName: tab.fileHandle?.name,
		isVirtual: tab.isVirtual,
		isModified: tab.isModified,
	});

	// 第一优先级：从缓存获取内容
	const cacheKey = getCacheKey(tab);
	const cachedContent = getCacheContent(cacheKey);

	if (cachedContent) {
		// 使用缓存内容
		console.log("从缓存加载内容:", {
			cacheKey,
			contentLength: cachedContent.content.length,
			isModified: cachedContent.isModified,
		});

		if (mdEditorRef.value) {
			mdEditorRef.value.setShouldLoadFileContent?.(false);
			nextTick(() => {
				if (mdEditorRef.value) {
					mdEditorRef.value.restoreModifiedContent(
						cachedContent.content,
						cachedContent.isModified
					);
				}
			});
		}
	} else {
		// 缓存不存在，允许编辑器加载文件内容
		console.log("缓存不存在，将从文件加载:", cacheKey);
		if (mdEditorRef.value) {
			mdEditorRef.value.setShouldLoadFileContent?.(true);
		}
	}
};

// 关闭页签
const closeTab = async (tabId: string) => {
	const tabIndex = openTabs.value.findIndex((t) => t.id === tabId);
	if (tabIndex === -1) return;

	const tab = openTabs.value[tabIndex];

	if (tab.isModified) {
		try {
			const action = await ElMessageBox.confirm(
				`文件 "${tab.title}" 有未保存的修改，是否保存后关闭？`,
				"确认关闭页签",
				{
					type: "warning",
					confirmButtonText: "保存并关闭",
					cancelButtonText: "不保存关闭",
					distinguishCancelAndClose: true,
					showClose: true,
				}
			);

			if (activeTabId.value === tabId && mdEditorRef.value) {
				await mdEditorRef.value.saveFile();
			}
		} catch (action) {
			if (action === "cancel") {
				// 继续执行关闭逻辑
			} else {
				return;
			}
		}
	}

	// 清除该标签页的缓存
	const cacheKey = getCacheKey(tab);
	clearCacheContent(cacheKey);

	openTabs.value.splice(tabIndex, 1);

	if (activeTabId.value === tabId) {
		if (openTabs.value.length > 0) {
			const newIndex = Math.max(
				0,
				Math.min(tabIndex - 1, openTabs.value.length - 1)
			);
			switchToTab(openTabs.value[newIndex].id);
		} else {
			activeTabId.value = null;
			currentFilePath.value = null;
			currentFileNode.value = null;
			fileModified.value = false;
		}
	}

	await saveTabsState();
};

// 关闭所有页签
const closeAllTabs = async () => {
	const modifiedTabs = openTabs.value.filter((tab) => tab.isModified);
	if (modifiedTabs.length > 0) {
		const confirmed = await ElMessageBox.confirm(
			`有 ${modifiedTabs.length} 个文件已修改，是否保存后关闭所有页签？`,
			"确认关闭所有页签",
			{
				type: "warning",
				confirmButtonText: "保存并关闭",
				cancelButtonText: "不保存关闭",
				distinguishCancelAndClose: true,
			}
		).catch((action) => {
			if (action === "cancel") {
				return "cancel";
			}
			return "close";
		});

		if (confirmed === "close") {
			return;
		} else if (confirmed !== "cancel") {
			for (const tab of modifiedTabs) {
				if (activeTabId.value === tab.id && mdEditorRef.value) {
					await mdEditorRef.value.saveFile();
				}
			}
		}
	}

	openTabs.value = [];
	activeTabId.value = null;
	currentFilePath.value = null;
	currentFileNode.value = null;
	fileModified.value = false;
};

// 显示右键菜单
const showContextMenu = (event: MouseEvent, tabId: string) => {
	event.preventDefault();
	contextMenuTabId.value = tabId;

	// 计算菜单位置，确保不超出屏幕边界
	const menuWidth = 200; // 预估菜单宽度
	const menuHeight = 160; // 预估菜单高度
	let x = event.clientX;
	let y = event.clientY;

	// 检查右边界
	if (x + menuWidth > window.innerWidth) {
		x = window.innerWidth - menuWidth - 10;
	}

	// 检查下边界
	if (y + menuHeight > window.innerHeight) {
		y = window.innerHeight - menuHeight - 10;
	}

	contextMenuPosition.value = { x, y };
	contextMenuVisible.value = true;
};

// 隐藏右键菜单
const hideContextMenu = () => {
	contextMenuVisible.value = false;
	contextMenuTabId.value = null;
};

// 关闭当前标签页左侧的所有标签页
const closeTabsToLeft = async (targetTabId: string) => {
	const targetIndex = openTabs.value.findIndex((tab) => tab.id === targetTabId);
	if (targetIndex <= 0) return;

	const tabsToClose = openTabs.value.slice(0, targetIndex);
	const modifiedTabs = tabsToClose.filter((tab) => tab.isModified);

	if (modifiedTabs.length > 0) {
		try {
			await ElMessageBox.confirm(
				`左侧有 ${modifiedTabs.length} 个文件已修改，是否保存后关闭？`,
				"确认关闭左侧标签页",
				{
					type: "warning",
					confirmButtonText: "保存并关闭",
					cancelButtonText: "不保存关闭",
					distinguishCancelAndClose: true,
				}
			);

			// 保存修改的文件
			for (const tab of modifiedTabs) {
				if (activeTabId.value === tab.id && mdEditorRef.value) {
					await mdEditorRef.value.saveFile();
				}
			}
		} catch (action) {
			if (action !== "cancel") {
				return;
			}
		}
	}

	// 移除左侧标签页
	openTabs.value.splice(0, targetIndex);
	await saveTabsState();
	hideContextMenu();
};

// 关闭当前标签页右侧的所有标签页
const closeTabsToRight = async (targetTabId: string) => {
	const targetIndex = openTabs.value.findIndex((tab) => tab.id === targetTabId);
	if (targetIndex === -1 || targetIndex >= openTabs.value.length - 1) return;

	const tabsToClose = openTabs.value.slice(targetIndex + 1);
	const modifiedTabs = tabsToClose.filter((tab) => tab.isModified);

	if (modifiedTabs.length > 0) {
		try {
			await ElMessageBox.confirm(
				`右侧有 ${modifiedTabs.length} 个文件已修改，是否保存后关闭？`,
				"确认关闭右侧标签页",
				{
					type: "warning",
					confirmButtonText: "保存并关闭",
					cancelButtonText: "不保存关闭",
					distinguishCancelAndClose: true,
				}
			);

			// 保存修改的文件
			for (const tab of modifiedTabs) {
				if (activeTabId.value === tab.id && mdEditorRef.value) {
					await mdEditorRef.value.saveFile();
				}
			}
		} catch (action) {
			if (action !== "cancel") {
				return;
			}
		}
	}

	// 移除右侧标签页
	openTabs.value.splice(targetIndex + 1);
	await saveTabsState();
	hideContextMenu();
};

// 关闭除当前标签页之外的所有标签页
const closeOtherTabs = async (targetTabId: string) => {
	const targetTab = openTabs.value.find((tab) => tab.id === targetTabId);
	if (!targetTab) return;

	const otherTabs = openTabs.value.filter((tab) => tab.id !== targetTabId);
	const modifiedTabs = otherTabs.filter((tab) => tab.isModified);

	if (modifiedTabs.length > 0) {
		try {
			await ElMessageBox.confirm(
				`其他 ${modifiedTabs.length} 个文件已修改，是否保存后关闭？`,
				"确认关闭其他标签页",
				{
					type: "warning",
					confirmButtonText: "保存并关闭",
					cancelButtonText: "不保存关闭",
					distinguishCancelAndClose: true,
				}
			);

			// 保存修改的文件
			for (const tab of modifiedTabs) {
				if (activeTabId.value === tab.id && mdEditorRef.value) {
					await mdEditorRef.value.saveFile();
				}
			}
		} catch (action) {
			if (action !== "cancel") {
				return;
			}
		}
	}

	// 只保留目标标签页
	openTabs.value = [targetTab];
	activeTabId.value = targetTabId;
	await saveTabsState();
	hideContextMenu();
};

// 拖拽开始
const onDragStart = () => {
	isDragging.value = true;
};

// 拖拽结束
const onDragEnd = async () => {
	isDragging.value = false;
	// 保存标签页状态
	await saveTabsState();
};

// 处理目录选择
const handleSelectDirectory = (dirPath: string, node: FileTreeNode) => {
	console.log("选择目录:", node.label);
};

// 处理文件删除
const handleFileDeleted = (deletedNode: FileTreeNode) => {
	console.log("文件被删除:", deletedNode.label);

	// 查找所有与被删除文件相关的标签页
	const affectedTabs = openTabs.value.filter((tab) => {
		if (!tab.filePath || !tab.fileNode) return false;

		// 检查是否是同一个文件（通过文件路径或节点ID比较）
		return (
			tab.fullPath === deletedNode.path ||
			tab.fileNode.id === deletedNode.id ||
			(tab.fileNode.label === deletedNode.label &&
				tab.filePath === deletedNode.path)
		);
	});

	// 将受影响的标签页转换为虚拟标签页
	affectedTabs.forEach((tab) => {
		console.log("将标签页转换为虚拟标签:", tab.title);

		// 保存当前内容到虚拟内容
		if (tab.modifiedContent) {
			tab.virtualContent = tab.modifiedContent;
		} else if (activeTabId.value === tab.id && mdEditorRef.value) {
			// 如果是当前活动标签，从编辑器获取内容
			const currentContent = mdEditorRef.value.getCurrentContent?.() || "";
			tab.virtualContent = currentContent;
		}

		// 转换为虚拟标签
		tab.isVirtual = true;
		tab.filePath = null;
		tab.fileNode = null;
		tab.fullPath = undefined;
		tab.modifiedContent = undefined;
		tab.title = deletedNode.label; // 保持原文件名作为标签名

		// 如果是当前活动标签，更新相关状态
		if (activeTabId.value === tab.id) {
			currentFilePath.value = null;
			currentFileNode.value = null;
			// 通知编辑器文件路径已清空，但保留内容
			nextTick(() => {
				if (mdEditorRef.value && tab.virtualContent) {
					mdEditorRef.value.restoreModifiedContent(tab.virtualContent, true);
				}
			});
		}
	});

	if (affectedTabs.length > 0) {
		ElNotification({
			title: "标签页状态更新",
			message: `已将 ${affectedTabs.length} 个相关标签页转换为新建状态`,
			type: "info",
			position: "bottom-right",
			duration: 3000,
			offset: 50,
		});
		saveTabsState();
	}
};

// 处理文件更新
const handleFileUpdated = (oldNode: FileTreeNode, newNode: FileTreeNode) => {
	console.log("文件被更新:", { old: oldNode.label, new: newNode.label });

	// 查找所有与被更新文件相关的标签页
	const affectedTabs = openTabs.value.filter((tab) => {
		if (!tab.filePath || !tab.fileNode) return false;

		// 检查是否是同一个文件
		return (
			tab.fullPath === oldNode.path ||
			tab.fileNode.id === oldNode.id ||
			(tab.fileNode.label === oldNode.label && tab.filePath === oldNode.path)
		);
	});

	// 更新受影响的标签页信息
	affectedTabs.forEach((tab) => {
		console.log("更新标签页信息:", { old: tab.title, new: newNode.label });

		tab.title = newNode.label;
		tab.fullPath = newNode.path;
		tab.fileNode = newNode;

		// 如果是当前活动标签，更新相关状态
		if (activeTabId.value === tab.id) {
			currentFileNode.value = newNode;
		}
	});

	if (affectedTabs.length > 0) {
		ElNotification({
			title: "文件信息更新",
			message: `已更新 ${affectedTabs.length} 个标签页的文件信息`,
			type: "info",
			position: "bottom-right",
			duration: 3000,
			offset: 50,
		});
		saveTabsState();
	}
};

// 处理文件修改状态
const handleFileModified = async (
	modified: boolean,
	modifiedContentParam?: string
) => {
	fileModified.value = modified;

	if (modifiedContentParam !== undefined) {
		modifiedContent.value = modifiedContentParam;
	}

	if (activeTabId.value) {
		const tab = openTabs.value.find((t) => t.id === activeTabId.value);
		if (tab) {
			tab.isModified = modified;

			// 更新缓存
			const cacheKey = getCacheKey(tab);
			const existingCache = getCacheContent(cacheKey);

			if (modified && modifiedContentParam !== undefined) {
				// 更新缓存内容
				if (existingCache) {
					existingCache.content = modifiedContentParam;
					existingCache.isModified = modified;
					existingCache.lastModified = Date.now();
					setCacheContent(cacheKey, existingCache);
				} else {
					// 创建新的缓存条目
					setCacheContent(cacheKey, {
						content: modifiedContentParam,
						originalContent: modifiedContentParam,
						isModified: modified,
						lastModified: Date.now(),
						lastAccessed: Date.now(),
					});
				}

				// 保持向后兼容
				if (tab.isVirtual) {
					tab.virtualContent = modifiedContentParam;
				} else {
					tab.modifiedContent = modifiedContentParam;
				}

				console.log("更新缓存和页签修改内容:", {
					cacheKey,
					tabId: tab.id,
					isVirtual: tab.isVirtual,
					contentLength: modifiedContentParam.length,
					isModified: modified,
				});
			} else if (!modified) {
				// 文件已保存，更新缓存状态
				if (existingCache) {
					existingCache.isModified = false;
					existingCache.lastModified = Date.now();
					setCacheContent(cacheKey, existingCache);
				}

				// 清除旧的内容字段
				if (tab.isVirtual) {
					tab.virtualContent = undefined;
				} else {
					tab.modifiedContent = undefined;
				}
				tab.lastSaveTime = Date.now();

				console.log("清除页签修改状态:", {
					cacheKey,
					tabId: tab.id,
					isVirtual: tab.isVirtual,
				});
			}
			await saveTabsState();
		}
	}
};

// 处理文件保存
const handleFileSaved = async (filePath: string) => {
	if (activeTabId.value) {
		const tab = openTabs.value.find((t) => t.id === activeTabId.value);
		if (tab) {
			tab.isModified = false;
			tab.modifiedContent = undefined;
			tab.lastSaveTime = Date.now();
			await saveTabsState();
		}
	}
};

// 检查是否有未保存的修改
const hasUnsavedChanges = computed(() => {
	return openTabs.value.some((tab) => tab.isModified);
});

// 获取未保存的文件列表
const getUnsavedFiles = () => {
	return openTabs.value.filter((tab) => tab.isModified).map((tab) => tab.title);
};

// 获取当前标签页是否为虚拟标签页
const getCurrentTabIsVirtual = () => {
	if (!activeTabId.value) return false;
	const tab = openTabs.value.find((t) => t.id === activeTabId.value);
	return tab?.isVirtual || false;
};

// 获取当前虚拟标签页的ID
const getCurrentVirtualTabId = () => {
	if (!activeTabId.value) return null;
	const tab = openTabs.value.find((t) => t.id === activeTabId.value);
	return tab?.isVirtual ? tab.id : null;
};

// 处理另存为请求
const handleSaveAsRequested = async (content: string) => {
	if (!rootDirectoryPath.value) {
		ElNotification({
			title: "保存失败",
			message: "请先选择文件夹，然后再进行保存操作",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	// 先设置内容和表单数据
	saveAsContent.value = content;

	// 设置默认保存目录为根目录
	saveAsForm.value.targetDirectory = rootDirectoryPath.value;
	saveAsForm.value.targetPath = "根目录";

	// 设置默认文件名 - 优先使用当前标签的名称
	const currentTab = openTabs.value.find((t) => t.id === activeTabId.value);

	if (currentTab) {
		// 使用标签的标题作为默认文件名，去掉扩展名
		let fileName = currentTab.title.replace(/\.[^/.]+$/, "");

		// 如果是默认的新建标签名，则使用更友好的名称
		if (/^新建标签\d+$/.test(fileName)) {
			fileName = "新建文档";
		}

		saveAsForm.value.fileName = fileName;
	} else if (currentFilePath.value) {
		const fileName = currentFilePath.value.split(/[\/\\]/).pop() || "新建文档";
		saveAsForm.value.fileName = fileName.replace(/\.[^/.]+$/, "");
	} else {
		saveAsForm.value.fileName = "新建文档";
	}

	// 最后显示保存对话框，确保所有数据都已设置
	showSaveAsDialog.value = true;
};

// 重置另存为对话框
const resetSaveAsDialog = () => {
	showSaveAsDialog.value = false;
	saveAsForm.value.fileName = "";
	saveAsForm.value.fileType = "md";
	saveAsForm.value.targetDirectory = null;
	saveAsForm.value.targetPath = "";
	saveAsContent.value = "";
};

// 文件夹选择相关
const showFolderSelector = ref(false);
const folderTreeData = ref<any[]>([]);

// 获取文件夹树数据
const getFolderTreeData = async () => {
	if (!rootDirectoryPath.value) {
		return [];
	}

	// 递归获取所有文件夹
	const getFoldersRecursively = async (
		dirPath: string,
		relativePath: string = ""
	): Promise<any[]> => {
		const folders: any[] = [];

		try {
			const result = await readDirectory(dirPath);
			for (const item of result) {
				if (item.isDirectory) {
					const fullPath = relativePath
						? `${relativePath}/${item.label}`
						: item.label;
					const folderNode = {
						id: fullPath,
						label: item.label,
						path: item.path,
						children: await getFoldersRecursively(item.path, fullPath),
					};
					folders.push(folderNode);
				}
			}
		} catch (error) {
			console.error("读取文件夹失败:", error);
		}

		return folders;
	};

	// 添加根目录选项
	const rootOption = {
		id: "",
		label: "根目录",
		path: rootDirectoryPath.value,
		children: await getFoldersRecursively(rootDirectoryPath.value),
	};

	return [rootOption];
};

// 选择保存目录
const selectSaveDirectory = async () => {
	if (!rootDirectoryPath.value) {
		ElNotification({
			title: "操作失败",
			message: "请先选择根目录",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	try {
		folderTreeData.value = await getFolderTreeData();
		showFolderSelector.value = true;
	} catch (error) {
		console.error("获取文件夹列表失败:", error);
		ElNotification({
			title: "获取文件夹列表失败",
			message: "无法加载文件夹结构",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	}
};

// 确认选择文件夹
const confirmFolderSelection = (selectedFolder: any) => {
	if (selectedFolder) {
		saveAsForm.value.targetDirectory = selectedFolder.path;
		saveAsForm.value.targetPath = selectedFolder.label;
		showFolderSelector.value = false;
		ElNotification({
			title: "目录选择成功",
			message: `已选择目录: ${selectedFolder.label}`,
			type: "success",
			position: "bottom-right",
			duration: 3000,
			offset: 50,
		});
	}
};

// 执行另存为操作
const saveAsFile = async () => {
	if (!saveAsForm.value.fileName.trim()) {
		ElNotification({
			title: "输入错误",
			message: "请输入文件名",
			type: "warning",
			position: "bottom-right",
			duration: 4000,
			offset: 50,
		});
		return;
	}

	if (!saveAsForm.value.targetDirectory) {
		ElNotification({
			title: "保存失败",
			message: "请选择保存目录",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	try {
		const fileName = saveAsForm.value.fileName.trim();
		const fileExtension = saveAsForm.value.fileType;
		const fullFileName = fileName.endsWith(`.${fileExtension}`)
			? fileName
			: `${fileName}.${fileExtension}`;

		const targetFilePath = `${saveAsForm.value.targetDirectory}/${fullFileName}`;

		// 检查文件是否已存在
		let fileExists = false;
		try {
			await window.electronAPI.readFile(targetFilePath);
			fileExists = true;
		} catch (error) {
			// 文件不存在，这是正常情况
			fileExists = false;
		}

		// 如果文件已存在，询问用户是否覆盖
		if (fileExists) {
			try {
				await ElMessageBox.confirm(
					`文件 "${fullFileName}" 已存在，是否要覆盖它？`,
					"文件已存在",
					{
						type: "warning",
						confirmButtonText: "覆盖",
						cancelButtonText: "取消",
						distinguishCancelAndClose: true,
					}
				);
			} catch (action) {
				// 用户取消了操作
				return;
			}
		}

		// 写入文件
		const writeResult = await window.electronAPI.writeFile(
			targetFilePath,
			saveAsContent.value
		);
		if (!writeResult.success) {
			throw new Error(writeResult.error || "写入文件失败");
		}

		// 将虚拟标签页转换为真实文件标签页
		const currentTab = openTabs.value.find((t) => t.id === activeTabId.value);
		if (currentTab && currentTab.isVirtual) {
			// 创建新的FileTreeNode
			const newNode: FileTreeNode = {
				id: fullFileName,
				label: fullFileName,
				path: targetFilePath,
				isDirectory: false,
				isFile: true,
			};

			// 更新标签页
			currentTab.filePath = targetFilePath;
			currentTab.fileNode = newNode;
			currentTab.title = fullFileName;
			currentTab.fullPath = targetFilePath;
			currentTab.isVirtual = false;
			currentTab.virtualContent = undefined;
			currentTab.isModified = false;
			currentTab.lastSaveTime = Date.now();

			// 更新当前文件状态
			currentFilePath.value = targetFilePath;
			currentFileNode.value = newNode;
			fileModified.value = false;
		}

		ElNotification({
			title: "文件保存成功",
			message: `文件 ${fullFileName} 已保存到 ${saveAsForm.value.targetPath}`,
			type: "success",
			position: "bottom-right",
			duration: 3000,
			offset: 50,
		});
		resetSaveAsDialog();

		// 刷新文件树
		if (fileTreeRef.value && fileTreeRef.value.loadFullDirectoryTree) {
			await fileTreeRef.value.loadFullDirectoryTree();
		}
	} catch (error) {
		console.error("另存为失败:", error);
		ElNotification({
			title: "另存为失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	}
};

// 确认关闭前的检查
const confirmBeforeClose = async (): Promise<boolean> => {
	if (!hasUnsavedChanges.value) {
		return true;
	}

	const unsavedFiles = getUnsavedFiles();
	const fileList =
		unsavedFiles.length > 3
			? unsavedFiles.slice(0, 3).join("、") +
				` 等 ${unsavedFiles.length} 个文件`
			: unsavedFiles.join("、");

	try {
		await ElMessageBox.confirm(
			`您有未保存的修改：${fileList}。关闭会丢失这些修改。`,
			"确认关闭",
			{
				type: "warning",
				confirmButtonText: "强制关闭",
				cancelButtonText: "取消",
				confirmButtonClass: "el-button--danger",
				distinguishCancelAndClose: true,
				showCancelButton: true,
				showClose: true,
				closeOnClickModal: false,
				closeOnPressEscape: false,
			}
		);
		return true;
	} catch (action) {
		return false;
	}
};

// 页面卸载前的确认
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
	if (hasUnsavedChanges.value) {
		event.preventDefault();
		event.returnValue = "您有未保存的修改，确定要离开吗？";
		return event.returnValue;
	}
};

// 开始调整大小
const startResize = (e: MouseEvent) => {
	isResizing.value = true;
	const startX = e.clientX;
	const startWidth = sidebarWidth.value;

	const onMouseMove = (e: MouseEvent) => {
		if (!isResizing.value) return;
		const deltaX = e.clientX - startX;
		const newWidth = startWidth + deltaX;
		if (newWidth >= 200 && newWidth <= 600) {
			sidebarWidth.value = newWidth;
		}
	};

	const onMouseUp = () => {
		isResizing.value = false;
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mouseup", onMouseUp);
};

// 切换折叠状态
const toggleCollapse = () => {
	isCollapsed.value = !isCollapsed.value;
};

// 键盘快捷键
const handleKeyboard = (e: KeyboardEvent) => {
	if (e.ctrlKey) {
		switch (e.key) {
			case "o":
				e.preventDefault();
				if (fileTreeRef.value) {
					fileTreeRef.value.selectRootDirectory();
				}
				break;
		}
	}
};

// 全局点击事件处理器，用于隐藏右键菜单
const handleGlobalClick = (event: Event) => {
	if (contextMenuVisible.value) {
		// 检查点击的目标是否是右键菜单本身
		const target = event.target as HTMLElement;
		const contextMenu = document.querySelector(
			".fixed.bg-white.dark\\:bg-gray-800"
		);

		// 如果点击的不是右键菜单内部，则隐藏菜单
		if (!contextMenu || !contextMenu.contains(target)) {
			hideContextMenu();
		}
	}
};

// 监听菜单事件
const setupMenuListeners = () => {
	if (window.electronAPI) {
		window.electronAPI.onMenuAction((action: string) => {
			switch (action) {
				case "open-folder":
					if (fileTreeRef.value) {
						fileTreeRef.value.selectRootDirectory();
					}
					break;
				case "open-file":
					handleOpenFileRequested();
					break;
				case "new-file":
					createNewTab();
					break;
				case "save":
					if (mdEditorRef.value) {
						mdEditorRef.value.saveFile();
					}
					break;
				case "save-as":
					if (activeTabId.value && mdEditorRef.value) {
						const content = mdEditorRef.value.getCurrentContent?.() || "";
						handleSaveAsRequested(content);
					}
					break;
			}
		});
	}
};

// 组件挂载
onMounted(async () => {
	document.addEventListener("keydown", handleKeyboard);
	document.addEventListener("click", handleGlobalClick, true); // 使用捕获阶段
	document.addEventListener("mousedown", handleGlobalClick, true); // 添加mousedown事件
	window.addEventListener("beforeunload", handleBeforeUnload);

	// 设置菜单事件监听
	setupMenuListeners();

	setTimeout(async () => {
		isInitializing.value = false;
		if (rootDirectoryPath.value) {
			await loadTabsState();
		}
	}, 500);
});

// 组件卸载
onUnmounted(async () => {
	document.removeEventListener("keydown", handleKeyboard);
	document.removeEventListener("click", handleGlobalClick, true);
	document.removeEventListener("mousedown", handleGlobalClick, true);
	window.removeEventListener("beforeunload", handleBeforeUnload);

	if (openTabs.value.length > 0) {
		await saveTabsState();
	}
});

// 监听根目录变化
watch(
	() => rootDirectoryPath.value,
	async (newPath) => {
		if (newPath && !isInitializing.value) {
			await loadTabsState();
		}
	}
);

// 监听当前文件变化
watch(
	() => currentFilePath.value,
	async (newPath) => {
		if (newPath) {
			try {
				const result = await window.electronAPI.readFile(newPath);
				if (result.success) {
					fileSize.value = result.content?.length || 0;
					modifiedContent.value = result.content || "";
				} else {
					console.error("获取文件信息失败:", result.error);
					fileSize.value = 0;
					modifiedContent.value = "";
				}
			} catch (error) {
				console.error("获取文件信息失败:", error);
				fileSize.value = 0;
				modifiedContent.value = "";
			}
		} else {
			fileSize.value = 0;
			modifiedContent.value = "";
		}
	}
);
</script>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
