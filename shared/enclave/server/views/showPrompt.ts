import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

export default function showPrompt(template: string, event: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptNonce = Math.floor(Math.random() * 1000000000000);
    const html = template
      .replace(/\$scriptNonce/g, scriptNonce.toString())
      .replace(/\$EVENT/g, event);

    let hasResolved = false;

    const window = new BrowserWindow({
      width: 320,
      height: 380,
      frame: false,
      backgroundColor: '#21252B',
      darkTheme: true,
      webPreferences: {
        // These prompts are local, static data URLs and require only ipcRenderer.
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false
      }
    });

    window.on('closed', () => {
      if (hasResolved) {
        return;
      }
      reject(new Error('ENCLAVE_TREZOR_CANCELED'));
    });

    ipcMain.once(event, (ipcEvent: IpcMainEvent, value: string) => {
      if (ipcEvent.sender !== window.webContents) {
        return;
      }
      try {
        resolve(value);
        hasResolved = true;
        window.close();
      } catch (e) {
        /**
         * @desc The window.close call sometimes fails
         *  if the window has already been destroyed.
         */
        console.error(e);
      }
    });

    window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`);
    window.show();
    window.focus();
  });
}
