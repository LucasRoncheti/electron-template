# Estrutura do projeto

```
.
├── build/                 # Recursos de build (ícones, assets para instalador)
├── electron/              # Processo principal do Electron
│   ├── main.js            # Cria janelas, splash, auto-update e IPC do Puppeteer
│   ├── preload.js         # Bridge segura entre renderer e processo principal
│   └── splash.html        # Tela de carregamento exibida antes da janela principal
├── frontend/              # Aplicação React + Vite (renderer)
│   ├── src/               # Código fonte do front-end
│   ├── public/            # Arquivos estáticos servidos pelo Vite
│   └── vite.config.ts     # Configuração do Vite para desenvolvimento e build
├── node_modules/          # Dependências instaladas (geradas pelo npm)
├── package.json           # Scripts de npm, dependências e config do electron-builder
└── package-lock.json      # Lockfile de dependências
```

## Destaques
- **Processo principal** (`electron/main.js`):
  - Cria uma janela de splash e a janela principal.
  - Configura o `autoUpdater` para buscar releases do GitHub e aciona instalação após download.
  - Expõe o handler IPC `run-puppeteer` que gera PDFs a partir de uma URL usando o Chromium do Puppeteer.
- **Renderer (frontend)**: aplicação Vite/React com TypeScript, servida em desenvolvimento pela porta 5173 e empacotada para produção em `frontend/dist`.
- **Configuração de build**: definida em `package.json` (campo `build`) com `appId`, `productName`, destino Windows (`nsis`) e `asarUnpack` para incluir o Chromium do Puppeteer.

## Scripts npm principais
- `npm run electron:dev`: inicia o Electron apontando para `http://localhost:5173` (Vite deve estar rodando).
- `npm run build:frontend`: instala dependências do front-end e gera `frontend/dist`.
- `npm run build`: executa o build do front-end e empacota o app com o electron-builder.
- `npm run release`: semelhante a `build`, mas publica a release (usado pelo auto-update).

> O script `puppeteer:test` referencia `scripts/puppeteer-test.mjs`, ainda não presente no repositório. Adicione-o se for usar testes automatizados com Puppeteer.
