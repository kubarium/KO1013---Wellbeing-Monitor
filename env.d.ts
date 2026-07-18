/// <reference types="@types/wicg-file-system-access" />
/// <reference types="vite/client" />
export {};

interface ImportMetaEnv {
  readonly VITE_PRIMEUI_LICENSE_KEY: string;
  // Add other env variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare global {
  // interface Window {
  //   showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  //   showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
  // }
}
