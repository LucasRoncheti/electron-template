# Build e publicação

## Build local para testes
1. Certifique-se de que as dependências da raiz e do `frontend/` estão instaladas.
2. Gere os artefatos do front-end (saem em `frontend/dist`):
   ```bash
   npm run build:frontend
   ```
3. Empacote a aplicação completa com o Electron Builder:
   ```bash
   npm run build
   ```
   O instalador e os binários gerados serão salvos na pasta `dist/` criada pelo Electron Builder.

## Publicação de release
- Use `npm run release` para gerar o build e publicar uma release no GitHub (provider configurado em `package.json`).
- O `electron-updater` irá consultar essas releases para habilitar o auto-update em produção. Mantenha o repositório configurado com permissões de publicação e marque as releases como públicas.

## Auto-update
- O processo principal chama `autoUpdater.checkForUpdatesAndNotify()` após inicializar.
- Atualizações são baixadas automaticamente (`autoDownload = true`) e a instalação é oferecida ao usuário após o download.
- No Windows, o alvo padrão é **NSIS** e o ícone esperado é `build/ico.ico`.

## Dicas de troubleshooting
- Se o download de updates falhar, verifique conectividade e permissões no GitHub.
- Quando o Chromium do Puppeteer for incluído no build, ele é descompactado via `asarUnpack` (já configurado). Problemas com PDFs geralmente envolvem caminhos incorretos ao `executablePath` em ambientes empacotados.
