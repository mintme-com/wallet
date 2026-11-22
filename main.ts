import 'babel-polyfill';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import handlers from 'shared/enclave/server/handlers';
import {
  EnclaveMethodParams,
  EnclaveMethods,
  EnclaveResponse
} from 'shared/enclave/types';
import { isValidEventType } from 'shared/enclave/utils';

let mainWindow: BrowserWindow | null = null;
let shapeShiftAuthorizationWindow: BrowserWindow | null = null;

function getRendererUrl(): string {
  return (
    process.env.VITE_DEV_SERVER_URL ||
    pathToFileURL(path.join(__dirname, '..', 'dist', 'index.html')).href
  );
}

function isMainRendererUrl(url: string): boolean {
  try {
    const current = new URL(url);
    const expected = new URL(getRendererUrl());
    return (
      current.protocol === expected.protocol &&
      current.host === expected.host &&
      (!!process.env.VITE_DEV_SERVER_URL || current.pathname === expected.pathname)
    );
  } catch (_) {
    return false;
  }
}

function isShapeShiftUrl(url: string, callback: boolean): boolean {
  try {
    const parsed = new URL(url);
    return callback
      ? parsed.origin === 'https://mycrypto.com' && parsed.pathname.startsWith('/swap')
      : parsed.origin === 'https://auth.shapeshift.io' && parsed.pathname === '/oauth/authorize';
  } catch (_) {
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 400,
    backgroundColor: '#fbfbfb',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(getRendererUrl());

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isMainRendererUrl(url)) {
      event.preventDefault();
      if (url.startsWith('https://')) {
        shell.openExternal(url);
      }
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  if (process.env.ELECTRON_OPEN_DEVTOOLS === '1') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.webContents.on('console-message', (_event, level, message, line, source) => {
    if (level >= 2) {
      console.error(`[Renderer ${level}] ${message} (${source}:${line})`);
    }
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error(`[Render process gone] reason: ${details.reason}, exitCode: ${details.exitCode}`);
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`[Load failed] ${errorCode}: ${errorDescription}`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('enclave', async (event, type: EnclaveMethods, params: EnclaveMethodParams) => {
  let response: EnclaveResponse;
  try {
    if (
      !mainWindow ||
      event.sender !== mainWindow.webContents ||
      !isMainRendererUrl(event.sender.getURL())
    ) {
      throw new Error('Enclave request rejected from an unknown window or origin');
    }
    if (!isValidEventType(type)) {
      throw new Error(`Invalid or unknown enclave method '${type}'`);
    }
    response = { data: await handlers[type](params) };
  } catch (err) {
    console.error(`Enclave request '${type}' failed:`, err);
    response = {
      error: {
        code: 500,
        type: err.name,
        message: err.message
      }
    };
  }
  return response;
});

ipcMain.on('shapeshift-authorize', (event, url: string) => {
  if (
    !mainWindow ||
    event.sender !== mainWindow.webContents ||
    !isMainRendererUrl(event.sender.getURL()) ||
    !isShapeShiftUrl(url, false)
  ) {
    return;
  }

  if (shapeShiftAuthorizationWindow) {
    shapeShiftAuthorizationWindow.close();
  }
  shapeShiftAuthorizationWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  const authorizationWindow = shapeShiftAuthorizationWindow;
  authorizationWindow.setMenu(null);
  authorizationWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  authorizationWindow.on('closed', () => {
    if (shapeShiftAuthorizationWindow === authorizationWindow) {
      shapeShiftAuthorizationWindow = null;
    }
  });
  authorizationWindow.loadURL(url);
});

ipcMain.on('shapeshift-token-retrieved', (event, token: string) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);
  if (
    !mainWindow ||
    !shapeShiftAuthorizationWindow ||
    senderWindow !== shapeShiftAuthorizationWindow ||
    !isShapeShiftUrl(event.sender.getURL(), true) ||
    typeof token !== 'string' ||
    !token
  ) {
    return;
  }

  mainWindow.webContents.send('shapeshift-set-token', token);
  senderWindow.close();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
