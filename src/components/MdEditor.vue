<template>
	<div class="h-full flex flex-col bg-white dark:bg-slate-800">
		<!-- 双行工具栏，仅在有标签时显示 -->
		<div
			v-if="tabCount > 0"
			class="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm"
		>
			<!-- 第一行工具栏：基础编辑功能 -->
			<div class="border-b border-slate-100 dark:border-slate-600">
				<!-- 左侧：Tiptap编辑按钮组（响应式换行布局） -->
				<div class="w-full">
					<div class="flex flex-wrap items-center gap-2 px-3 py-2">
						<!-- 基础文本格式化工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								@click="editor?.chain().focus().toggleBold().run()"
								title="粗体"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
								:class="{
									'!bg-gradient-to-r !from-blue-600 !to-purple-600 !border-none !text-white !shadow-md':
										editor?.isActive('bold'),
									'!bg-white dark:!bg-slate-800 !border-slate-300 dark:!border-slate-600 !text-slate-700 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-700':
										!editor?.isActive('bold'),
								}"
							>
								<Icon icon="material-symbols:format-bold" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="editor?.chain().focus().toggleItalic().run()"
								title="斜体"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
								:class="{
									'!bg-gradient-to-r !from-blue-600 !to-purple-600 !border-none !text-white !shadow-md':
										editor?.isActive('italic'),
									'!bg-white dark:!bg-slate-800 !border-slate-300 dark:!border-slate-600 !text-slate-700 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-700':
										!editor?.isActive('italic'),
								}"
							>
								<Icon icon="material-symbols:format-italic" class="text-base" />
							</el-button>
							<el-button
								size="default"
								:type="editor?.isActive('strike') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleStrike().run()"
								title="删除线"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon
									icon="material-symbols:format-strikethrough"
									class="text-base"
								/>
							</el-button>
							<el-button
								size="default"
								@click="editor?.chain().focus().toggleUnderline().run()"
								title="下划线"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
								:class="{
									'!bg-gradient-to-r !from-blue-600 !to-purple-600 !border-none !text-white !shadow-md':
										editor?.isActive('underline'),
									'!bg-white dark:!bg-slate-800 !border-slate-300 dark:!border-slate-600 !text-slate-700 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-700':
										!editor?.isActive('underline'),
								}"
							>
								<Icon
									icon="material-symbols:format-underlined"
									class="text-base"
								/>
							</el-button>
							<el-button
								size="default"
								:type="editor?.isActive('code') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleCode().run()"
								title="行内代码"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:code" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 标题下拉菜单 -->
						<el-dropdown trigger="click">
							<el-button
								size="default"
								class="!rounded-md !shadow-sm transition-all duration-200 !min-w-14 !h-7 !px-2"
								title="标题样式"
							>
								<div class="flex items-center gap-1">
									<span class="text-sm font-medium">{{
										currentHeadingType
									}}</span>
									<Icon
										icon="material-symbols:keyboard-arrow-down"
										class="text-sm"
									/>
								</div>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu class="min-w-40 p-2">
									<el-dropdown-item
										@click.native="editor?.chain().focus().setParagraph().run()"
										:class="{
											'font-bold text-base': editor?.isActive('paragraph'),
										}"
										>正文
										<span class="ml-4 text-xs text-slate-400"
											>Alt Ctrl 0</span
										></el-dropdown-item
									>
									<el-dropdown-item
										v-for="level in [1, 2, 3, 4, 5, 6]"
										:key="level"
										@click.native="
											editor
												?.chain()
												.focus()
												.toggleHeading({
													level: level as 1 | 2 | 3 | 4 | 5 | 6,
												})
												.run()
										"
										:class="{
											'font-bold': editor?.isActive('heading', { level }),
										}"
									>
										<span :class="'text-lg font-bold'">标题{{ level }}</span>
										<span class="ml-4 text-xs text-slate-400"
											>Alt Ctrl {{ level }}</span
										>
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 列表工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								:type="editor?.isActive('bulletList') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleBulletList().run()"
								title="无序列表"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon
									icon="material-symbols:format-list-bulleted"
									class="text-base"
								/>
							</el-button>
							<el-button
								size="default"
								:type="editor?.isActive('orderedList') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleOrderedList().run()"
								title="有序列表"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon
									icon="material-symbols:format-list-numbered"
									class="text-base"
								/>
							</el-button>
							<el-button
								size="default"
								:type="editor?.isActive('taskList') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleTaskList().run()"
								title="任务列表"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:checklist" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 引用和代码块工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								:type="editor?.isActive('blockquote') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleBlockquote().run()"
								title="引用"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:format-quote" class="text-base" />
							</el-button>
							<el-button
								size="default"
								:type="editor?.isActive('codeBlock') ? 'primary' : 'default'"
								@click="editor?.chain().focus().toggleCodeBlock().run()"
								title="代码块"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:code-blocks" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="insertDetails"
								title="插入折叠区域"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:expand-more" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 插入工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								@click="
									editor
										?.chain()
										.focus()
										.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
										.run()
								"
								title="插入表格"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:table" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="insertMermaidChart"
								title="插入Mermaid"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:insert-chart" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="editor?.chain().focus().setHorizontalRule().run()"
								title="分割线"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon
									icon="material-symbols:horizontal-rule"
									class="text-base"
								/>
							</el-button>
							<el-button
								size="default"
								@click="convertCodeBlocks"
								title="转换代码块语法 (``` ↔ :::)"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:transform" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
						<!-- 撤销重做工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								@click="editor?.chain().focus().undo().run()"
								:disabled="!editor?.can().undo()"
								title="撤销"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:undo" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="editor?.chain().focus().redo().run()"
								:disabled="!editor?.can().redo()"
								title="重做"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:redo" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 导出工具组 -->
						<div class="flex items-center gap-1">
							<el-button
								size="default"
								@click="exportMarkdown"
								title="导出Markdown"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:description" class="text-base" />
							</el-button>
							<el-button
								size="default"
								@click="exportImage"
								title="导出为图片"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:image" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 文件操作组 -->
						<div class="flex items-center gap-1">
							<el-button
								v-if="fileHandle && !isVirtual"
								@click="reloadFile"
								:disabled="isLoading"
								title="重新加载"
								size="default"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon
									icon="material-symbols:refresh"
									class="text-base"
									:class="{ 'animate-spin': isLoading }"
								/>
							</el-button>
							<el-button
								v-if="fileHandle && !isVirtual"
								@click="saveFile"
								:disabled="isSaving"
								title="保存文件"
								size="default"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0 !bg-green-600 hover:!bg-green-700 !text-white !border-green-600"
							>
								<Icon icon="material-symbols:save" class="text-base" />
							</el-button>
							<el-button
								v-if="isVirtual"
								@click="saveAsFile"
								:disabled="isSaving"
								title="另存为文件"
								size="default"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0 !bg-blue-600 hover:!bg-blue-700 !text-white !border-blue-600"
							>
								<Icon icon="material-symbols:save-as" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 模式切换组 -->
						<div class="flex items-center gap-1">
							<el-button
								@click="toggleEditorMode('wysiwyg')"
								:class="
									editorMode === 'wysiwyg'
										? '!bg-blue-600 !text-white !border-blue-600'
										: ''
								"
								size="default"
								title="富文本模式"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:palette" class="text-base" />
							</el-button>
							<el-button
								@click="toggleEditorMode('split')"
								:class="
									editorMode === 'split'
										? '!bg-blue-600 !text-white !border-blue-600'
										: ''
								"
								size="default"
								title="分屏模式"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:view-column" class="text-base" />
							</el-button>
						</div>

						<!-- 分隔线 -->
						<div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

						<!-- 功能切换组 -->
						<div class="flex items-center gap-1">
							<el-button
								@click="showSearchDialog = true"
								size="default"
								title="查找/替换 (Ctrl+F)"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:search" class="text-base" />
							</el-button>
							<el-button
								@click="showToc = !showToc"
								size="default"
								:class="
									showToc ? '!bg-blue-600 !text-white !border-blue-600' : ''
								"
								title="显示/隐藏大纲目录"
								class="!rounded-md !shadow-sm transition-all duration-200 !w-7 !h-7 !p-0"
							>
								<Icon icon="material-symbols:toc" class="text-base" />
							</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 编辑器主体 -->
		<div class="flex-1 flex flex-col">
			<!-- 欢迎界面 - 当没有页签时显示 -->
			<div
				v-if="tabCount === 0"
				class="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
			>
				<div class="text-center max-w-md mx-auto px-8">
					<!-- 欢迎图标 -->
					<div class="mb-8">
						<Icon
							icon="material-symbols:edit-document-outline"
							class="text-8xl text-slate-400 dark:text-slate-500 mx-auto"
						/>
					</div>

					<!-- 欢迎标题 -->
					<h1
						class="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4"
					>
						欢迎使用文档编辑器
					</h1>

					<!-- 欢迎描述 -->
					<p
						class="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed"
					>
						开始您的创作之旅，选择打开现有文件或创建新的文档
					</p>

					<!-- 操作按钮 -->
					<div class="flex flex-col gap-4">
						<el-button
							type="primary"
							size="large"
							@click="$emit('open-file-requested')"
							class="!h-12 !text-base !font-medium !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300"
						>
							<Icon icon="material-symbols:folder-open" class="mr-2 text-lg" />
							打开文件
						</el-button>

						<el-button
							type="primary"
							size="large"
							@click="$emit('open-folder-requested')"
							class="!h-12 !text-base !font-medium !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300"
						>
							<Icon icon="material-symbols:folder-open" class="mr-2 text-lg" />
							打开文件夹
						</el-button>
					</div>
				</div>
			</div>

			<!-- 编辑器内容区域 -->
			<div v-else class="flex-1 flex flex-col relative">
				<!-- 目录弹窗 - 移到最外层，确保在所有模式下都能显示 -->
				<transition
					enter-active-class="transition-opacity duration-300 ease-out"
					leave-active-class="transition-opacity duration-300 ease-out"
					enter-from-class="opacity-0"
					leave-to-class="opacity-0"
				>
					<div
						v-if="showToc"
						ref="tocPanel"
						class="absolute right-0 inset-y-0 w-72 bg-white/95 dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-6 overflow-y-auto flex flex-col animate-in slide-in-from-right-5 duration-300"
					>
						<h3
							class="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2"
						>
							📑 文档大纲
						</h3>
						<div v-if="tocItems.length > 0" class="space-y-1">
							<div
								v-for="item in tocItems"
								:key="item.id"
								class="pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-1"
							>
								<a
									class="block py-1 px-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer text-slate-700 dark:text-slate-200 text-sm"
									:class="{
										'ml-0': item.level === 1,
										'ml-3': item.level === 2,
										'ml-6': item.level === 3,
										'ml-9': item.level === 4,
										'ml-12': item.level === 5,
										'ml-15': item.level === 6,
									}"
									@click="jumpToHeading(item.id)"
								>
									{{ item.text }}
								</a>
							</div>
						</div>
						<div
							v-else
							class="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-sm py-8"
						>
							<Icon
								icon="material-symbols:article-outline"
								class="text-4xl mb-2 opacity-50"
							/>
							<p class="text-center">暂无标题</p>
							<p class="text-center text-xs mt-1">
								在文档中添加标题后，大纲将在此显示
							</p>
						</div>
					</div>
				</transition>

				<!-- 查找弹窗 - 移到最外层，确保在所有模式下都能显示 -->
				<transition
					enter-active-class="transition-opacity duration-300 ease-out"
					leave-active-class="transition-opacity duration-300 ease-out"
					enter-from-class="opacity-0"
					leave-to-class="opacity-0"
				>
					<div
						v-if="showSearchDialog"
						ref="searchPanel"
						class="absolute right-0 top-8 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 backdrop-blur-sm animate-in slide-in-from-right-5 slide-in-from-top-2 duration-300"
					>
						<!-- 关闭按钮 - 右上角绝对定位 -->
						<el-button
							@click="showSearchDialog = false"
							size="small"
							title="关闭"
							class="!absolute !top-3 !right-3 !p-1.5 !w-6 !h-6 !rounded-md !bg-slate-100 dark:!bg-slate-600 !border-slate-200 dark:!border-slate-500 !text-slate-600 dark:!text-slate-400 hover:!bg-slate-200 dark:hover:!bg-slate-500 !shadow-sm transition-all duration-200 !z-10"
						>
							<Icon icon="material-symbols:close" class="text-xs" />
						</el-button>

						<!-- 搜索内容区域 -->
						<div class="p-6">
							<h3
								class="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2"
							>
								🔍 查找和替换
							</h3>

							<!-- 搜索输入框 -->
							<div class="space-y-3">
								<el-input
									v-model="searchTerm"
									placeholder="输入搜索内容..."
									class="search-input"
									@input="onSearchInput"
									@keydown.enter="findNext"
								>
									<template #prefix>
										<Icon icon="material-symbols:search" />
									</template>
								</el-input>

								<!-- 替换输入框 -->
								<el-input
									v-model="replaceTerm"
									placeholder="输入替换内容..."
									@keydown.enter="replaceOne"
								>
									<template #prefix>
										<Icon icon="material-symbols:find-replace" />
									</template>
								</el-input>

								<!-- 搜索选项 -->
								<div class="flex flex-wrap gap-2 text-sm">
									<el-checkbox v-model="caseSensitive" size="small">
										区分大小写
									</el-checkbox>
									<el-checkbox v-model="regexEnabled" size="small">
										正则表达式
									</el-checkbox>
								</div>

								<!-- 搜索结果统计 -->
								<div
									v-if="searchTerm && searchResults.total > 0"
									class="text-sm text-slate-600 dark:text-slate-400"
								>
									{{ searchResults.current }}/{{ searchResults.total }} 个结果
								</div>

								<!-- 操作按钮 -->
								<div class="flex gap-2">
									<el-button
										@click="findPrev"
										size="small"
										:disabled="!searchTerm || searchResults.total === 0"
										title="上一个 (Shift+Enter)"
									>
										<Icon icon="material-symbols:keyboard-arrow-up" />
									</el-button>
									<el-button
										@click="findNext"
										size="small"
										:disabled="!searchTerm || searchResults.total === 0"
										title="下一个 (Enter)"
									>
										<Icon icon="material-symbols:keyboard-arrow-down" />
									</el-button>
									<el-button
										@click="replaceOne"
										size="small"
										:disabled="
											!searchTerm || !replaceTerm || searchResults.total === 0
										"
										title="替换"
									>
										替换
									</el-button>
									<el-button
										@click="replaceAll"
										size="small"
										:disabled="
											!searchTerm || !replaceTerm || searchResults.total === 0
										"
										title="全部替换"
									>
										全部替换
									</el-button>
								</div>
							</div>
						</div>
					</div>
				</transition>

				<!-- 编辑器主内容区 -->
				<div class="flex-1 flex flex-col">
					<!-- 编辑器内容区 -->
					<div class="flex-1 flex flex-col">
						<!-- 富文本编辑模式 -->
						<div
							v-if="editorMode === 'wysiwyg'"
							class="flex-1 flex flex-col px-3 py-2 bg-slate-50 dark:bg-slate-900"
						>
							<div
								class="flex-1 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl relative min-h-0"
							>
								<!-- 使用Tiptap的内置Markdown支持 -->
								<EditorContent
									:editor="editor"
									class="absolute inset-0 pt-8 pr-8 pb-8 pl-15 overflow-y-auto"
								/>
								<!-- 气泡菜单 -->
								<bubble-menu
									v-if="editor"
									:editor="editor"
									:tippy-options="{ duration: 100 }"
									class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 flex gap-1"
								>
									<button
										@click="editor?.chain().focus().toggleBold().run()"
										:class="{
											'bg-blue-500 text-white': editor?.isActive('bold'),
											'hover:bg-slate-200 dark:hover:bg-slate-700':
												!editor?.isActive('bold'),
										}"
										class="px-2 py-1 rounded flex items-center justify-center transition-colors duration-200"
										title="粗体"
									>
										<Icon icon="material-symbols:format-bold" class="text-sm" />
									</button>
									<button
										@click="editor?.chain().focus().toggleItalic().run()"
										:class="{
											'bg-blue-500 text-white': editor?.isActive('italic'),
											'hover:bg-slate-200 dark:hover:bg-slate-700':
												!editor?.isActive('italic'),
										}"
										class="px-2 py-1 rounded flex items-center justify-center transition-colors duration-200"
										title="斜体"
									>
										<Icon
											icon="material-symbols:format-italic"
											class="text-sm"
										/>
									</button>
									<button
										@click="editor?.chain().focus().toggleStrike().run()"
										:class="{
											'bg-blue-500 text-white': editor?.isActive('strike'),
											'hover:bg-slate-200 dark:hover:bg-slate-700':
												!editor?.isActive('strike'),
										}"
										class="px-2 py-1 rounded flex items-center justify-center transition-colors duration-200"
										title="删除线"
									>
										<Icon
											icon="material-symbols:format-strikethrough"
											class="text-sm"
										/>
									</button>
									<button
										@click="editor?.chain().focus().toggleUnderline().run()"
										:class="{
											'bg-blue-500 text-white': editor?.isActive('underline'),
											'hover:bg-slate-200 dark:hover:bg-slate-700':
												!editor?.isActive('underline'),
										}"
										class="px-2 py-1 rounded flex items-center justify-center transition-colors duration-200"
										title="下划线"
									>
										<Icon
											icon="material-symbols:format-underlined"
											class="text-sm"
										/>
									</button>
								</bubble-menu>

								<EditorContent
									:editor="editor"
									class="absolute inset-0 pt-8 pr-8 pb-8 pl-15 overflow-y-auto"
								/>
							</div>
						</div>

						<!-- 分屏模式 -->
						<div
							v-else-if="editorMode === 'split'"
							class="flex-1 flex gap-4 p-3 bg-slate-50 dark:bg-slate-900"
						>
							<!-- 左侧：Markdown源码 -->
							<div class="flex-1 flex flex-col">
								<div class="mb-2">
									<span
										class="text-sm font-medium text-slate-700 dark:text-slate-300"
										>Markdown源码</span
									>
								</div>
								<el-input
									v-model="markdownContent"
									type="textarea"
									:autosize="false"
									placeholder="# 标题&#10;&#10;这里是Markdown源码..."
									class="flex-1 font-mono text-sm markdown-editor-input"
									resize="none"
									@input="handleMarkdownInput"
								/>
							</div>

							<!-- 右侧：富文本编辑器 -->
							<div class="flex-1 flex flex-col">
								<div class="mb-2">
									<span
										class="text-sm font-medium text-slate-700 dark:text-slate-300"
										>富文本预览</span
									>
								</div>
								<div
									class="flex-1 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg relative min-h-0"
								>
									<EditorContent
										:editor="editor"
										class="absolute inset-0 pt-6 pr-6 pb-6 pl-15 overflow-y-auto"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue 核心功能导入
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUnmounted,
	ref,
	watch,
} from "vue";

// Element Plus 组件导入
import { ElMessageBox, ElNotification } from "element-plus";

// Iconify Vue 图标导入
import { Icon } from "@iconify/vue";

// Tiptap 相关导入
import { StarterKit } from "@syfxlin/tiptap-starter-kit";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { EditorContent, useEditor } from "@tiptap/vue-3";
// @ts-ignore
import TableOfContents from "@tiptap/extension-table-of-contents";
// @ts-ignore
import SearchAndReplace from "@sereneinserenade/tiptap-search-and-replace";

// 文件操作相关导入
import { getFileType, readFile, writeFile } from "../utils/file-service";
import type { FileTreeNode } from "../utils/types";

// 引入html2canvas
import html2canvas from "html2canvas";

// 组件Props接口定义
interface Props {
	filePath?: string | null;
	fileNode?: FileTreeNode | null;
	tabCount?: number;
	isVirtual?: boolean;
	virtualTabId?: string | null;
}

// 组件事件接口定义
interface Emits {
	(e: "file-modified", isModified: boolean, modifiedContent?: string): void;
	(e: "file-saved", filePath: string): void;
	(e: "save-as-requested", content: string): void;
	(e: "open-file-requested"): void;
	(e: "open-folder-requested"): void;
	(e: "new-tab-requested"): void;
	(e: "clear-cache-requested"): void;
}

// 组件属性和事件定义
const props = withDefaults(defineProps<Props>(), {
	fileHandle: null,
	fileNode: null,
	tabCount: 0,
	isVirtual: false,
	virtualTabId: null,
});

const emit = defineEmits<Emits>();

// 文件和编辑器状态
const isLoading = ref(false);
const isSaving = ref(false);
const isModified = ref(false);

const originalContent = ref("");
const markdownContent = ref("");
const editorMode = ref<"wysiwyg" | "split">("wysiwyg");

// 编辑器配置状态
const defaultEditorMode = ref<"wysiwyg" | "split">("wysiwyg");
const autoSave = ref(false);

// 自动保存定时器
let autoSaveTimer: NodeJS.Timeout | null = null;

// 当前编辑的文件名
const fileName = computed(() => {
	return (
		props.fileNode?.label ||
		(props.filePath ? props.filePath.split(/[\/\\]/).pop() : "") ||
		""
	);
});

// 初始化Tiptap编辑器实例
const editor = useEditor({
	extensions: [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3, 4, 5, 6],
			},
			mermaid: true,
			table: true,
			markdown: true,
			clipboard: true,
			emoji: true,
			blockMenu: true,
			floatMenu: true,
			clickMenu: true,
			codeBlock: true,
		}),
		SearchAndReplace.configure({
			searchResultClass: "search-result",
			disableRegex: false,
		}),
		TableOfContents.configure({
			onUpdate: (updatedAnchors: any[]) => {
				anchors.value = updatedAnchors;
			},
		}),
	],
	content: "",
	editorProps: {
		attributes: {
			class:
				"h-full overflow-y-auto outline-none prose prose-slate dark:prose-invert max-w-none",
		},
	},
	onUpdate: ({ editor }) => {
		if (editorMode.value === "wysiwyg" || editorMode.value === "split") {
			if (editor.storage.markdown && editor.storage.markdown.get) {
				markdownContent.value = editor.storage.markdown.get();
			} else {
				markdownContent.value = editor.getHTML();
			}
		}

		checkModified();
	},
	onSelectionUpdate: () => {
		// 当光标位置改变时，计算属性会自动重新计算
		// 这里不需要额外的逻辑，Vue的响应式系统会处理
	},
	onCreate: ({ editor }) => {
		// 编辑器创建完成
	},
});

// 处理Markdown源码模式下的输入事件
const handleMarkdownInput = () => {
	if (editorMode.value === "split" && editor.value) {
		if (editor.value.storage.markdown && editor.value.storage.markdown.set) {
			editor.value.storage.markdown.set(markdownContent.value);
		} else {
			editor.value.commands.setContent(markdownContent.value);
		}

		checkModified();
	}
};

// 切换编辑器模式
const toggleEditorMode = (mode: "wysiwyg" | "split") => {
	if (!editor.value) return;

	if (mode === "split") {
		// 分屏模式：同步当前内容到markdown
		if (editor.value.storage.markdown && editor.value.storage.markdown.get) {
			markdownContent.value = editor.value.storage.markdown.get();
		} else {
			markdownContent.value = editor.value.getHTML();
		}
	}

	editorMode.value = mode;
};

// 加载文件内容到编辑器
const loadFileContent = async () => {
	if (!props.filePath) {
		console.log("MdEditor: 没有filePath，跳过加载");
		return;
	}

	try {
		isLoading.value = true;
		console.log("MdEditor: 开始加载文件内容", {
			filePath: props.filePath,
			hasFileNode: !!props.fileNode,
		});

		const content = await readFile(props.filePath);
		console.log("MdEditor: 文件内容读取完成", {
			contentLength: content.length,
			contentPreview:
				content.substring(0, 200) + (content.length > 200 ? "..." : ""),
			contentType: typeof content,
		});

		originalContent.value = content;
		markdownContent.value = content;
		isModified.value = false;

		if (editor.value) {
			console.log("MdEditor: 设置编辑器内容", {
				editorExists: !!editor.value,
				hasMarkdownStorage: !!(
					editor.value.storage.markdown && editor.value.storage.markdown.set
				),
				contentLength: content.length,
			});

			if (editor.value.storage.markdown && editor.value.storage.markdown.set) {
				editor.value.storage.markdown.set(content);
				console.log("MdEditor: 使用markdown storage设置内容");
			} else {
				editor.value.commands.setContent(content);
				console.log("MdEditor: 使用setContent命令设置内容");
			}

			setTimeout(() => {
				if (editor.value) {
					const editorContent = editor.value.getHTML();
					console.log("MdEditor: 编辑器内容验证", {
						editorContentLength: editorContent.length,
						editorContentPreview:
							editorContent.substring(0, 200) +
							(editorContent.length > 200 ? "..." : ""),
						contentMatches: editorContent.length > 0,
					});
				}
			}, 100);
		} else {
			console.error("MdEditor: 编辑器实例不存在！");
		}

		const fileType = getFileType(fileName.value);
		if (fileType === "markdown") {
			editorMode.value = defaultEditorMode.value;
		} else {
			editorMode.value = "wysiwyg";
		}

		console.log("MdEditor: 文件加载完成", {
			fileType,
			editorMode: editorMode.value,
			isModified: isModified.value,
		});
	} catch (error) {
		console.error("MdEditor: 加载文件失败", error);
		ElNotification({
			title: "加载文件失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	} finally {
		isLoading.value = false;
	}
};

// 检查文件是否已被修改
const checkModified = () => {
	if (!editor.value) return;

	let currentContent = "";
	if (editor.value.storage.markdown && editor.value.storage.markdown.get) {
		currentContent = editor.value.storage.markdown.get();
	} else {
		currentContent = editor.value.getHTML();
	}

	const modified = currentContent !== originalContent.value;
	if (modified !== isModified.value) {
		isModified.value = modified;
		emit("file-modified", modified, modified ? currentContent : undefined);

		if (modified && autoSave.value) {
			scheduleAutoSave();
		}
	}
};

// 安排自动保存任务
const scheduleAutoSave = () => {
	if (autoSaveTimer) {
		clearTimeout(autoSaveTimer);
	}
	autoSaveTimer = setTimeout(() => {
		if (isModified.value) {
			saveFile();
		}
	}, 2000);
};

// 保存文件
const saveFile = async () => {
	if (!props.filePath || !editor.value) return;

	try {
		isSaving.value = true;
		let content = "";
		if (editor.value.storage.markdown && editor.value.storage.markdown.get) {
			content = editor.value.storage.markdown.get();
		} else {
			content = editor.value.getHTML();
		}

		await writeFile(props.filePath, content);
		originalContent.value = content;
		markdownContent.value = content;
		isModified.value = false;
		emit("file-modified", false);
		emit("file-saved", props.filePath);

		ElNotification({
			title: "保存成功",
			message: `文件 ${fileName.value} 已保存`,
			type: "success",
			duration: 2000,
		});
	} catch (error) {
		ElNotification({
			title: "保存文件失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	} finally {
		isSaving.value = false;
	}
};

// 另存为文件（用于虚拟标签页）
const saveAsFile = async () => {
	if (!editor.value) return;

	try {
		isSaving.value = true;
		let content = "";
		if (editor.value.storage.markdown && editor.value.storage.markdown.get) {
			content = editor.value.storage.markdown.get();
		} else {
			content = editor.value.getHTML();
		}

		// 发射事件让父组件处理另存为逻辑
		emit("save-as-requested", content);
	} catch (error) {
		ElNotification({
			title: "获取内容失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	} finally {
		isSaving.value = false;
	}
};

// 重新加载文件
const reloadFile = async () => {
	if (isModified.value) {
		const confirmed = await ElMessageBox.confirm(
			"文件已修改，重新加载将丢失未保存的更改。是否继续？",
			"确认重新加载",
			{ type: "warning" }
		).catch(() => false);

		if (!confirmed) return;
	}

	// 通知父组件清除缓存
	emit("clear-cache-requested");

	// 强制重新加载文件内容
	await loadFileContent();
};

// 搜索和字符统计相关的状态变量
const showSearchDialog = ref(false);
const searchTerm = ref("");
const replaceTerm = ref("");
const regexEnabled = ref(false);
const caseSensitive = ref(false);
// 搜索结果相关状态
const searchResults = ref({ current: 0, total: 0 });
const searchPositions = ref<number[]>([]);
const currentSearchIndex = ref(-1);

// 恢复修改的内容
const restoreModifiedContent = (content: string, modified: boolean = true) => {
	if (!editor.value) return;

	console.log("MdEditor: 恢复修改的内容", {
		contentLength: content.length,
		isModified: modified,
	});

	// 设置标志，阻止下次文件句柄变化时重新加载文件
	shouldLoadFileContent.value = false;

	if (editor.value.storage.markdown && editor.value.storage.markdown.set) {
		editor.value.storage.markdown.set(content);
	} else {
		editor.value.commands.setContent(content);
	}

	markdownContent.value = content;
	originalContent.value = content; // 设置原始内容，避免立即触发修改状态
	isModified.value = modified;
};

// 插入Mermaid图表
const insertMermaidChart = () => {
	if (!editor.value) return;

	const defaultMermaidCode =
		"graph TD\n    A[开始] --> B[处理]\n    B --> C[结束]";
	if (editor.value.commands.setMermaid) {
		// @ts-ignore
		editor.value.commands.setMermaid(defaultMermaidCode);
	}
};

// 插入可折叠内容
const insertDetails = () => {
	if (!editor.value) return;
	try {
		editor.value
			.chain()
			.focus()
			.insertContent(
				`
<details>
<summary>点击展开</summary>

</details>
`
			)
			.run();
	} catch (error) {
		console.error("插入可折叠内容失败:", error);
	}
};

// 转换代码块语法（``` ↔ :::）
const convertCodeBlocks = () => {
	if (!editor.value) return;
};

// 工具栏方法实现

const exportMarkdown = () => {
	if (!editor.value) {
		ElNotification({
			title: "导出失败",
			message: "编辑器未初始化",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	let content = "";

	// 尝试多种方式获取内容
	if (editorMode.value === "split") {
		// 如果当前是分屏模式，直接使用markdownContent
		content = markdownContent.value;
	} else if (
		editor.value.storage.markdown &&
		editor.value.storage.markdown.get
	) {
		// 尝试从markdown storage获取
		content = editor.value.storage.markdown.get();
	} else {
		// 备用方案：使用当前的markdownContent或从编辑器获取HTML
		content = markdownContent.value || editor.value.getHTML();
	}

	if (!content || content.trim() === "") {
		ElNotification({
			title: "导出提示",
			message: "没有内容可以导出",
			type: "warning",
			position: "bottom-right",
			duration: 4000,
			offset: 50,
		});
		return;
	}

	console.log("导出Markdown内容:", {
		mode: editorMode.value,
		contentLength: content.length,
		hasMarkdownStorage: !!(
			editor.value.storage.markdown && editor.value.storage.markdown.get
		),
	});

	const blob = new Blob([content], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${fileName.value || "document"}.md`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	ElNotification({
		title: "导出成功",
		message: "Markdown文件导出成功",
		type: "success",
		position: "bottom-right",
		duration: 3000,
		offset: 50,
	});
};

// 导出为图片（支持长图导出）
const exportImage = async () => {
	const editorContent = document.querySelector(".ProseMirror");
	if (!editorContent) {
		ElNotification({
			title: "导出失败",
			message: "未找到编辑器内容区域",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	// 获取滚动容器（EditorContent的容器）
	const scrollContainer = editorContent.parentElement;
	if (!scrollContainer) {
		ElNotification({
			title: "导出失败",
			message: "未找到滚动容器",
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
		return;
	}

	// 显示加载提示
	const loadingNotification = ElNotification({
		title: "正在处理",
		message: "正在生成图片，请稍候...",
		type: "info",
		position: "bottom-right",
		duration: 0, // 不自动关闭
		offset: 50,
	});

	// 保存原始样式
	const originalContainerStyles = {
		overflow: scrollContainer.style.overflow,
		height: scrollContainer.style.height,
		maxHeight: scrollContainer.style.maxHeight,
		position: scrollContainer.style.position,
		width: scrollContainer.style.width,
		padding: scrollContainer.style.padding,
		boxSizing: scrollContainer.style.boxSizing,
	};

	try {
		// 获取完整内容尺寸
		const fullHeight = editorContent.scrollHeight;
		const fullWidth = editorContent.scrollWidth;

		// 计算合适的宽度，确保有足够的左右边距
		const horizontalPadding = 64; // 左右各32px边距
		const minContentWidth = 600; // 最小内容宽度
		const maxContentWidth = 1200; // 最大内容宽度

		// 基于内容宽度计算容器宽度，确保左右边距一致
		const contentWidth = Math.min(
			Math.max(fullWidth, minContentWidth),
			maxContentWidth
		);
		const containerWidth = contentWidth + horizontalPadding;
		const containerHeight = fullHeight + 64; // 上下padding

		console.log("导出图片 - 内容尺寸:", {
			fullHeight,
			fullWidth,
			contentWidth,
			containerWidth,
			containerHeight,
		});

		// 临时修改容器样式，让所有内容可见并居中
		scrollContainer.style.overflow = "visible";
		scrollContainer.style.height = `${containerHeight}px`;
		scrollContainer.style.width = `${containerWidth}px`;
		scrollContainer.style.maxHeight = "none";
		scrollContainer.style.position = "static";
		scrollContainer.style.padding = "32px"; // 确保四周都有32px边距
		scrollContainer.style.boxSizing = "border-box";

		// 等待样式应用和重新渲染 - 增加等待时间确保高质量渲染
		await new Promise((resolve) => setTimeout(resolve, 500));

		// 截图配置 - 截取整个容器而不是只截取编辑器内容
		const canvas = await html2canvas(scrollContainer as HTMLElement, {
			backgroundColor: "#ffffff", // 设置白色背景
			height: containerHeight,
			width: containerWidth,
			useCORS: true,
			allowTaint: true,
			scale: 2, // 高质量缩放
			scrollX: 0,
			scrollY: 0,
			windowWidth: containerWidth,
			windowHeight: containerHeight,
		});

		console.log("导出图片 - 画布尺寸:", {
			width: canvas.width,
			height: canvas.height,
		});

		// 下载高质量图片
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					ElNotification({
						title: "生成图片失败",
						message: "无法生成图片文件",
						type: "error",
						position: "bottom-right",
						duration: 5000,
						offset: 50,
					});
					return;
				}

				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `${fileName.value || "document"}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				ElNotification({
					title: "导出成功",
					message: "高质量图片导出成功",
					type: "success",
					position: "bottom-right",
					duration: 3000,
					offset: 50,
				});
			},
			"image/png",
			1.0
		); // 最高图片质量 - 无损压缩
	} catch (error) {
		console.error("导出图片失败:", error);
		ElNotification({
			title: "导出图片失败",
			message: (error as Error).message,
			type: "error",
			position: "bottom-right",
			duration: 5000,
			offset: 50,
		});
	} finally {
		// 恢复容器原始样式
		scrollContainer.style.overflow = originalContainerStyles.overflow;
		scrollContainer.style.height = originalContainerStyles.height;
		scrollContainer.style.maxHeight = originalContainerStyles.maxHeight;
		scrollContainer.style.position = originalContainerStyles.position;
		scrollContainer.style.width = originalContainerStyles.width;
		scrollContainer.style.padding = originalContainerStyles.padding;
		scrollContainer.style.boxSizing = originalContainerStyles.boxSizing;

		// 关闭加载提示
		loadingNotification.close();
	}
};

// 添加一个标志来控制是否应该加载文件内容
const shouldLoadFileContent = ref(true);

// 监听文件路径变化
watch(
	() => props.filePath,
	(newPath, oldPath) => {
		console.log("MdEditor: filePath变化监听触发", {
			newPath: newPath,
			oldPath: oldPath,
			hasEditor: !!editor.value,
			shouldLoadFileContent: shouldLoadFileContent.value,
		});

		if (newPath) {
			if (shouldLoadFileContent.value) {
				console.log("MdEditor: 检测到新文件路径，开始加载内容");
				loadFileContent();
			} else {
				console.log(
					"MdEditor: 检测到新文件路径，但跳过加载（等待恢复缓存内容）"
				);
				// 重置标志，下次正常加载
				shouldLoadFileContent.value = true;
			}
		} else {
			console.log("MdEditor: 文件路径为空，清空编辑器内容");
			if (editor.value) {
				editor.value.commands.setContent("");
			}
			markdownContent.value = "";
			originalContent.value = "";
			isModified.value = false;
		}
	}
);

// 监听虚拟页签ID变化
watch(
	() => props.virtualTabId,
	(newVirtualTabId, oldVirtualTabId) => {
		console.log("MdEditor: virtualTabId变化监听触发", {
			newVirtualTabId,
			oldVirtualTabId,
			isVirtual: props.isVirtual,
			hasEditor: !!editor.value,
		});

		// 只有在虚拟页签模式下才处理virtualTabId变化
		if (
			props.isVirtual &&
			newVirtualTabId &&
			newVirtualTabId !== oldVirtualTabId
		) {
			console.log("MdEditor: 虚拟页签ID变化，清空编辑器内容");
			if (editor.value) {
				editor.value.commands.setContent("");
			}
			markdownContent.value = "";
			originalContent.value = "";
			isModified.value = false;
		}
	}
);

// 监听编辑器初始化
watch(editor, (newEditor) => {
	if (newEditor) {
		// 编辑器初始化完成
	}
});

// 组件挂载时的初始化
onMounted(() => {
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key === "s") {
			e.preventDefault();
			if (isModified.value) {
				saveFile();
			}
		}
		// 添加 Ctrl/Cmd + F 快捷键打开搜索
		if ((e.ctrlKey || e.metaKey) && e.key === "f") {
			e.preventDefault();
			showSearchDialog.value = true;
		}
		// ESC 键关闭搜索对话框
		if (e.key === "Escape" && showSearchDialog.value) {
			e.preventDefault();
			showSearchDialog.value = false;
		}
	});

	// 手动触发filePath的初始化逻辑
	if (props.filePath) {
		loadFileContent();
	} else {
		// 没有文件时重置状态
		if (editor.value) {
			editor.value.commands.setContent("");
		}
		markdownContent.value = "";
		originalContent.value = "";
		isModified.value = false;
	}
});

// 组件卸载时的清理
onUnmounted(() => {
	if (autoSaveTimer) {
		clearTimeout(autoSaveTimer);
	}
});

// 组件卸载前的清理
onBeforeUnmount(() => {
	if (editor.value) {
		editor.value.destroy();
	}
});

// 获取当前编辑器内容
const getCurrentContent = () => {
	if (!editor.value) return "";

	if (editor.value.storage.markdown && editor.value.storage.markdown.get) {
		return editor.value.storage.markdown.get();
	} else {
		return markdownContent.value || editor.value.getHTML();
	}
};

// 设置是否应该加载文件内容的方法
const setShouldLoadFileContent = (should: boolean) => {
	shouldLoadFileContent.value = should;
};

// 暴露给父组件的方法
defineExpose({
	reloadFile,
	saveFile,
	restoreModifiedContent,
	getCurrentContent,
	setShouldLoadFileContent,
});

const onSearchInput = () => {
	if (editor.value) {
		// 只有在搜索对话框显示且有搜索内容时才进行搜索
		if (showSearchDialog.value && searchTerm.value.trim()) {
			// 更新搜索词
			editor.value.commands.setSearchTerm(searchTerm.value);
			// 收集搜索结果位置
			collectSearchPositions();
		} else {
			// 清除搜索
			editor.value.commands.setSearchTerm("");
			searchPositions.value = [];
			searchResults.value = { current: 0, total: 0 };
			currentSearchIndex.value = -1;
		}
	}
};

// 收集搜索结果位置
const collectSearchPositions = () => {
	if (!editor.value || !searchTerm.value) {
		searchPositions.value = [];
		searchResults.value = { current: 0, total: 0 };
		currentSearchIndex.value = -1;
		return;
	}

	const positions: number[] = [];
	const doc = editor.value.state.doc;

	// 遍历文档找到所有匹配位置
	doc.descendants((node, pos) => {
		if (node.isText && node.text) {
			const originalText = node.text;
			let searchText = searchTerm.value;
			let textToSearch = originalText;

			// 处理大小写敏感
			if (!caseSensitive.value) {
				searchText = searchText.toLowerCase();
				textToSearch = originalText.toLowerCase();
			}

			if (regexEnabled.value) {
				try {
					const flags = caseSensitive.value ? "g" : "gi";
					const regex = new RegExp(searchText, flags);
					let match;
					while ((match = regex.exec(originalText)) !== null) {
						positions.push(pos + match.index);
						if (match[0].length === 0) break; // 防止无限循环
					}
				} catch (e) {
					// 正则表达式无效时使用普通搜索
					let index = 0;
					while ((index = textToSearch.indexOf(searchText, index)) !== -1) {
						positions.push(pos + index);
						index += searchText.length;
					}
				}
			} else {
				// 普通搜索
				let index = 0;
				while ((index = textToSearch.indexOf(searchText, index)) !== -1) {
					positions.push(pos + index);
					index += searchText.length;
				}
			}
		}
	});

	searchPositions.value = positions;
	searchResults.value = {
		current: positions.length > 0 ? 1 : 0,
		total: positions.length,
	};
	currentSearchIndex.value = positions.length > 0 ? 0 : -1;
};

// 查找下一个/上一个功能
const findNext = () => {
	if (!editor.value || searchPositions.value.length === 0) return;

	// 计算下一个索引
	const nextIndex =
		(currentSearchIndex.value + 1) % searchPositions.value.length;
	currentSearchIndex.value = nextIndex;

	// 跳转到位置
	const pos = searchPositions.value[nextIndex];
	editor.value
		.chain()
		.focus()
		.setTextSelection({ from: pos, to: pos + searchTerm.value.length })
		.scrollIntoView()
		.run();

	// 更新统计
	searchResults.value.current = nextIndex + 1;
};

const findPrev = () => {
	if (!editor.value || searchPositions.value.length === 0) return;

	// 计算上一个索引
	const prevIndex =
		currentSearchIndex.value === 0
			? searchPositions.value.length - 1
			: currentSearchIndex.value - 1;
	currentSearchIndex.value = prevIndex;

	// 跳转到位置
	const pos = searchPositions.value[prevIndex];
	editor.value
		.chain()
		.focus()
		.setTextSelection({ from: pos, to: pos + searchTerm.value.length })
		.scrollIntoView()
		.run();

	// 更新统计
	searchResults.value.current = prevIndex + 1;
};
const replaceOne = () => {
	if (editor.value && searchTerm.value && replaceTerm.value) {
		// @ts-ignore - 使用可能的API命令
		editor.value.commands.replace?.() || editor.value.commands.replaceNext?.();
	}
};
const replaceAll = () => {
	if (editor.value && searchTerm.value && replaceTerm.value) {
		// @ts-ignore - 使用可能的API命令
		editor.value.commands.replaceAll?.();
	}
};

// 移除搜索结果统计功能

// 监听搜索选项变化
watch([regexEnabled, caseSensitive], () => {
	if (searchTerm.value) {
		onSearchInput();
	}
});

// 监听搜索对话框状态，隐藏时清除搜索
watch(showSearchDialog, (isVisible) => {
	if (!isVisible && editor.value) {
		// 清除搜索高亮
		editor.value.commands.setSearchTerm("");
		searchPositions.value = [];
		searchResults.value = { current: 0, total: 0 };
		currentSearchIndex.value = -1;
	}
});

// 监听搜索对话框显示状态，自动聚焦到输入框
watch(showSearchDialog, (show) => {
	if (show) {
		nextTick(() => {
			const searchInput = document.querySelector(".search-input input");
			if (searchInput) {
				(searchInput as HTMLInputElement).focus();
			}
		});
	}
});

// 目录面板显示状态
const showToc = ref(false);
// 大纲锚点数据
const anchors = ref<any[]>([]);

// 当前标题类型计算属性 - 用于标题按钮联动显示
const currentHeadingType = computed(() => {
	if (!editor.value) return "标题";

	// 检查各级标题
	for (let level = 1; level <= 6; level++) {
		if (editor.value.isActive("heading", { level })) {
			return `标题${level}`;
		}
	}

	// 检查是否为正文段落
	if (editor.value.isActive("paragraph")) {
		return "正文";
	}

	// 检查其他块级元素
	if (
		editor.value.isActive("bulletList") ||
		editor.value.isActive("orderedList") ||
		editor.value.isActive("taskList")
	) {
		return "列表";
	}

	if (editor.value.isActive("blockquote")) {
		return "引用";
	}

	if (editor.value.isActive("codeBlock")) {
		return "代码";
	}

	// 默认返回
	return "标题";
});

// 目录数据
const tocItems = computed(() =>
	anchors.value.map((anchor) => ({
		id: anchor.id,
		text: anchor.textContent,
		level: anchor.level,
		pos: anchor.pos,
	}))
);
// 目录跳转方法
const jumpToHeading = (id: string) => {
	if (!editor.value || !id) return;

	// 找到对应的anchor
	const anchor = anchors.value.find((a) => a.id === id);
	if (anchor) {
		// 使用链式调用聚焦、定位和滚动
		editor.value
			.chain()
			.focus()
			.setTextSelection(anchor.pos)
			.scrollIntoView()
			.run();
	}
};

const tocPanel = ref<HTMLElement | null>(null);
const searchPanel = ref<HTMLElement | null>(null);

// 目录弹窗外部点击和Esc关闭逻辑
watch(showToc, (visible) => {
	if (visible) {
		nextTick(() => {
			const onClick = (e: MouseEvent) => {
				const panel = tocPanel.value;
				if (panel && !panel.contains(e.target as Node)) {
					showToc.value = false;
				}
			};
			const onKeydown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					showToc.value = false;
				}
			};
			document.addEventListener("mousedown", onClick);
			document.addEventListener("keydown", onKeydown);
			// 关闭时移除监听
			const stop = watch(showToc, (v) => {
				if (!v) {
					document.removeEventListener("mousedown", onClick);
					document.removeEventListener("keydown", onKeydown);
					stop();
				}
			});
		});
	}
});

// 查找弹窗外部点击和Esc关闭逻辑
watch(showSearchDialog, (visible) => {
	if (visible) {
		nextTick(() => {
			const onClick = (e: MouseEvent) => {
				const panel = searchPanel.value;
				if (panel && !panel.contains(e.target as Node)) {
					showSearchDialog.value = false;
				}
			};
			const onKeydown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					showSearchDialog.value = false;
				}
			};
			document.addEventListener("mousedown", onClick);
			document.addEventListener("keydown", onKeydown);
			// 关闭时移除监听
			const stop = watch(showSearchDialog, (v) => {
				if (!v) {
					document.removeEventListener("mousedown", onClick);
					document.removeEventListener("keydown", onKeydown);
					stop();
				}
			});
		});
	}
});
</script>

<style scoped>
/* 搜索结果高亮样式 - 使用UnoCSS设计理念的颜色值 */
:deep(.search-result) {
	background: rgba(253, 224, 71, 0.3); /* yellow-300 with 30% opacity */
	border-radius: 0.25rem; /* rounded-sm */
	padding: 0.125rem 0.25rem; /* px-0.5 py-px */
}

:deep(.search-result.current) {
	background: rgba(251, 146, 60, 0.5); /* orange-400 with 50% opacity */
	outline: 2px solid #ea580c; /* outline-2 outline-orange-600 */
}

/* Markdown编辑器输入框样式 - 使用UnoCSS设计理念 */
:deep(.markdown-editor-input .el-textarea__inner) {
	height: 100% !important; /* h-full */
	padding: 2rem !important; /* p-8 (32px) */
	background: white !important; /* bg-white */
	border: 2px solid #e2e8f0 !important; /* border-2 border-slate-200 */
	border-radius: 1rem !important; /* rounded-2xl (16px) */
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; /* shadow-2xl */
	font-size: 0.875rem !important; /* text-sm (14px) */
	font-family:
		ui-monospace, SFMono-Regular, Consolas, monospace !important; /* font-mono */
	line-height: 1.6 !important; /* leading-relaxed */
}

/* 深色模式下的Markdown编辑器样式 */
:deep(.dark .markdown-editor-input .el-textarea__inner) {
	background: #1e293b !important; /* dark:bg-slate-800 */
	border-color: #475569 !important; /* dark:border-slate-600 */
	color: #f1f5f9 !important; /* dark:text-slate-100 */
}
</style>
