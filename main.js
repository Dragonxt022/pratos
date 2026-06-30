const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const PORT = 3000;
let mainWindow;

app.whenReady().then(async () => {
  const userData = app.getPath('userData');

  // Forcar SQLite e uploads fora do asar (diretorio do usuario)
  process.env.DB_DIALECT = 'sqlite';
  process.env.DB_STORAGE = path.join(userData, 'database.sqlite');
  process.env.UPLOADS_PATH = path.join(userData, 'uploads', 'pratos');
  process.env.PORT = String(PORT);
  process.env.NODE_ENV = 'production';

  // Iniciar servidor Express (aguarda sync do banco + listen)
  const { start } = require('./app');
  await start();

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 680,
    minHeight: 500,
    icon: path.join(__dirname, 'public', 'logos', 'favicone.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Abrir links externos no navegador padrao
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 1100,
      height: 820,
      minWidth: 680,
      minHeight: 500,
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    });
    mainWindow.loadURL(`http://localhost:${PORT}`);
  }
});
