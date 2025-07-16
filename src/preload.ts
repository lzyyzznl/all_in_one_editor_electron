import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  showOpenDialog: (options: any) => Promise<any>;
  showSaveDialog: (options: any) => Promise<any>;
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  readDirectory: (dirPath: string) => Promise<{ success: boolean; items?: any[]; error?: string }>;
  createDirectory: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
  deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  renameFile: (oldPath: string, newPath: string) => Promise<{ success: boolean; error?: string }>;
  showItemInFolder: (filePath: string) => void;
  onMenuAction: (callback: (action: string) => void) => void;
}

const electronAPI: ElectronAPI = {
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', dirPath),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('rename-file', oldPath, newPath),
  showItemInFolder: (filePath) => ipcRenderer.invoke('show-item-in-folder', filePath),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-file', () => callback('new-file'));
    ipcRenderer.on('menu-open-file', () => callback('open-file'));
    ipcRenderer.on('menu-open-folder', () => callback('open-folder'));
    ipcRenderer.on('menu-save', () => callback('save'));
    ipcRenderer.on('menu-save-as', () => callback('save-as'));
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}