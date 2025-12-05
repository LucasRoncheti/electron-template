
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const puppeteer = require("puppeteer");




function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // por enquanto deixamos bem simples
      contextIsolation: true,
      nodeIntegration: false,
    preload: path.join(__dirname, "preload.js"),
    },
  });


  const startUrl = process.env.ELECTRON_START_URL;

  if (startUrl) {
    win.loadURL(startUrl);
    win.webContents.openDevTools();
  } else {
    // fallback pra build (a gente arruma isso depois)
    win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }
}



  app.whenReady().then(() => {
  createWindow();



  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



// IPC handler para rodar o Puppeteer

ipcMain.handle("run-puppeteer", async (event,urlSite) => {
  


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
     path:pdfPath,
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


