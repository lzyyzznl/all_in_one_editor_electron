import type { FileTreeNode } from './types';

export class ElectronFileService {
  async openDirectory(): Promise<string | null> {
    const result = await window.electronAPI.showOpenDialog({
      properties: ['openDirectory'],
      title: '选择文件夹',
    });
    
    if (result.canceled || !result.filePaths.length) {
      return null;
    }
    
    return result.filePaths[0];
  }

  async openFile(): Promise<{ path: string; content: string } | null> {
    const result = await window.electronAPI.showOpenDialog({
      properties: ['openFile'],
      title: '打开文件',
      filters: [
        { name: 'Markdown文件', extensions: ['md', 'markdown'] },
        { name: '文本文件', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    });
    
    if (result.canceled || !result.filePaths.length) {
      return null;
    }
    
    const filePath = result.filePaths[0];
    const fileResult = await window.electronAPI.readFile(filePath);
    
    if (!fileResult.success) {
      throw new Error(fileResult.error);
    }
    
    return {
      path: filePath,
      content: fileResult.content!,
    };
  }

  async saveFile(filePath: string, content: string): Promise<void> {
    const result = await window.electronAPI.writeFile(filePath, content);
    if (!result.success) {
      throw new Error(result.error);
    }
  }

  async saveAsFile(content: string, defaultName?: string): Promise<string | null> {
    const result = await window.electronAPI.showSaveDialog({
      title: '另存为',
      defaultPath: defaultName || 'untitled.md',
      filters: [
        { name: 'Markdown文件', extensions: ['md'] },
        { name: '文本文件', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    });
    
    if (result.canceled || !result.filePath) {
      return null;
    }
    
    await this.saveFile(result.filePath, content);
    return result.filePath;
  }

  async readDirectory(dirPath: string): Promise<FileTreeNode[]> {
    const result = await window.electronAPI.readDirectory(dirPath);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.items!.map(item => ({
      name: item.name,
      path: item.path,
      type: item.isDirectory ? 'directory' : 'file',
      children: item.isDirectory ? [] : undefined,
    }));
  }

  async createFile(dirPath: string, fileName: string): Promise<string> {
    const filePath = `${dirPath}/${fileName}`;
    await this.saveFile(filePath, '');
    return filePath;
  }

  async createDirectory(dirPath: string, dirName: string): Promise<string> {
    const newDirPath = `${dirPath}/${dirName}`;
    const result = await window.electronAPI.createDirectory(newDirPath);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return newDirPath;
  }

  async deleteFile(filePath: string): Promise<void> {
    const result = await window.electronAPI.deleteFile(filePath);
    if (!result.success) {
      throw new Error(result.error);
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    const result = await window.electronAPI.renameFile(oldPath, newPath);
    if (!result.success) {
      throw new Error(result.error);
    }
  }

  showItemInFolder(filePath: string): void {
    window.electronAPI.showItemInFolder(filePath);
  }
}

export const fileService = new ElectronFileService();