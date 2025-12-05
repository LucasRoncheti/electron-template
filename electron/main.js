const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { autoUpdater } = require("electron-updater");
const { dialog } = require("electron");

const isDev = !app.isPackaged;

let mainWindow;
let splashWindow;


/**
 * Janela de splash / loading
 */
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,          // sem borda
    transparent: false,    // pode deixar true se quiser
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    show: true,
  });

  splashWindow.loadFile(path.join(__dirname, "splash.html"));
}

/**
 * Janela principal
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false, // começa escondida
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "..", "frontend", "dist", "index.html")
    );
  }

  // Quando estiver pronto para exibir
  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/**
 * Enviar status de update para o renderer
 */
function sendStatus(text) {
  console.log("[AUTO-UPDATER]", text);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", text);
  }
}

/**
 * Configuração do AutoUpdater
 */
function setupAutoUpdater() {
  if (!app.isPackaged) {
    sendStatus("AutoUpdater desativado em modo dev.");
    return;
  }

  sendStatus("Configurando AutoUpdater...");

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("checking-for-update", () => {
    sendStatus("Verificando atualizações...");
  });

  autoUpdater.on("update-available", (info) => {
    sendStatus(`Atualização disponível: versão ${info.version}`);
  });

  autoUpdater.on("update-not-available", () => {
    sendStatus("Nenhuma atualização disponível.");
  });

  autoUpdater.on("error", (err) => {
    sendStatus(
      `Erro no autoUpdater: ${
        err == null ? "desconhecido" : err.message || String(err)
      }`
    );
  });

  autoUpdater.on("download-progress", (progress) => {
    sendStatus(`Baixando update: ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    sendStatus(
      `Update ${info.version} baixado. Será instalado ao fechar o app.`
    );
  });

  autoUpdater.checkForUpdatesAndNotify();
}


autoUpdater.on("update-downloaded", async (info) => {
  sendStatus(`Update ${info.version} baixado.`);

  const result = await dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "Atualização disponível",
    message: `A versão ${info.version} foi baixada e está pronta para ser instalada.`,
    detail: "O aplicativo será fechado e a nova versão será instalada. Não desligue o computador durante o processo.",
    buttons: ["Instalar agora", "Depois"],
    defaultId: 0,
    cancelId: 1,
  });

  if (result.response === 0) {
    // 👉 Aqui ele FECHA o app e dispara o instalador
    autoUpdater.quitAndInstall(); 
  } else {
    sendStatus("Usuário optou por instalar depois.");
  }
});

/**
 * Ciclo de vida do app
 */
app.whenReady().then(() => {
  createSplashWindow();
  createWindow();
  setupAutoUpdater();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow();
      createWindow();
      // Não precisa chamar setupAutoUpdater de novo
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * IPC handler para rodar o Puppeteer
 */
ipcMain.handle("run-puppeteer", async (_event, urlSite) => {
  try {
    const isProd = app.isPackaged;

    // Corrige caminho do chrome quando empacotado
    const executablePathPatched = puppeteer
      .executablePath()
      .replace("app.asar", "app.asar.unpacked");

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: isProd ? executablePathPatched : puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const url = urlSite;

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    const title = await page.title();
    console.log("Título da página:", title);

    // Monta pasta base e nome do arquivo seguro
    const safeName = url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]/gi, "_");

    const baseFolder = isProd
      ? path.join(app.getPath("documents"), "MeuApp")
      : path.join(__dirname, "..", "files");

    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
    }

    const pdfPath = path.join(baseFolder, `${safeName}.pdf`);

    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: "A4",
      landscape: true,
    });

    await browser.close();

    return { success: true, pdfPath };
  } catch (err) {
    console.error("Puppeteer erro:", err);
    return { success: false, error: err.message || String(err) };
  }
});
