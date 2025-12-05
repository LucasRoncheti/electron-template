const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const puppeteer = require("puppeteer");
const { autoUpdater } = require("electron-updater");

const isDev = !app.isPackaged; 

let mainWindow; // 👈 guarda a janela

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  }
}

function sendStatus(text) {
  console.log("[AUTO-UPDATER]", text);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", text);
  }
}

function setupAutoUpdater() {
  if (!app.isPackaged) {
    sendStatus("AutoUpdater desativado em modo dev.");
    return;
  }

  sendStatus("Configurando AutoUpdater...");

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

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
    sendStatus(`Erro no autoUpdater: ${err == null ? "desconhecido" : err.message}`);
  });

  autoUpdater.on("download-progress", (progress) => {
    sendStatus(`Baixando update: ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    sendStatus(`Update ${info.version} baixado. Será instalado ao fechar o app.`);
  });

  autoUpdater.checkForUpdatesAndNotify();
}


app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



// IPC handler para rodar o Puppeteer

ipcMain.handle("run-puppeteer", async (event, urlSite) => {
  try {
    const isProd = app.isPackaged;

    const executablePath = puppeteer
      .executablePath()
      .replace("app.asar", "app.asar.unpacked");

    const browser = await puppeteer.launch({
      headless: false,
      executablePath: isProd ? executablePath : puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const url = urlSite;
    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    const title = await page.title();
    console.log("Título:", title);

    let pdfPath;
    if (isProd) {
      const baseFolder = path.join(app.getPath("documents"), "MeuApp");
      pdfPath = path.join(baseFolder, `${url.replace("https://", "")}.pdf`);
    } else {
      pdfPath = `files/${url.replace("https://", "")}.pdf`;
    }

    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
    }

    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: "A4", // ou "Letter"
      landscape: true, // vira horizontal se quiser
    });

    await browser.close();

    return true;
  } catch (err) {
    console.error("Puppeteer erro:", err);
    return false;
  }
});
