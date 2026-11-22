declare module '*?worker' {
  const workerConstructor: new () => Worker;
  export default workerConstructor;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

interface ElectronAPI {
  invokeEnclave<T>(
    type: string,
    params: unknown
  ): Promise<{
    data?: T;
    error?: { code: number; type: string; message: string };
  }>;
  onShapeShiftToken(callback: (token: string) => void): () => void;
  authorizeShapeShift(url: string): void;
  setShapeShiftToken(token: string): void;
}

interface Window {
  electronAPI?: ElectronAPI;
}
