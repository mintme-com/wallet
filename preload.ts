import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invokeEnclave: (type: string, params: unknown) => ipcRenderer.invoke('enclave', type, params),
  onShapeShiftToken: (callback: (token: string) => void) => {
    const listener = (_event: unknown, token: string) => callback(token);
    ipcRenderer.on('shapeshift-set-token', listener);
    return () => ipcRenderer.removeListener('shapeshift-set-token', listener);
  },
  authorizeShapeShift: (url: string) => ipcRenderer.send('shapeshift-authorize', url),
  setShapeShiftToken: (token: string) => ipcRenderer.send('shapeshift-token-retrieved', token)
});
