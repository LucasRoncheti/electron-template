# Ambiente de desenvolvimento

## Pré-requisitos
- **Node.js 20.x (LTS)** e **npm** configurados no PATH.
- Sistema operacional com suporte ao Electron Builder (Windows, macOS ou Linux). Para gerar instaladores Windows em outras plataformas pode ser necessário provisionar certificados e ferramentas adicionais.
- Acesso ao GitHub para publicar releases (utilizado pelo `electron-updater`).

## Instalação das dependências
1. Na raiz do projeto (onde ficam `package.json` e `package-lock.json`), instale as dependências do processo principal Electron e das ferramentas de build:
   ```bash
   npm install
   ```
2. Instale as dependências do front-end React/Vite:
   ```bash
   cd frontend
   npm install
   ```

> Se você reinstalar módulos, limpe a pasta `node_modules` correspondente antes de repetir os comandos.

## Variáveis de ambiente úteis
- `ELECTRON_START_URL`: utilizada pelo script `electron:dev` para apontar o Electron para o servidor Vite em desenvolvimento (valor padrão `http://localhost:5173`).
- `DEBUG=electron-builder`: habilita logs detalhados do processo de build quando necessário.

## Dependências principais
- **electron**: runtime desktop.
- **electron-builder**: empacotamento e geração de instaladores.
- **electron-updater**: atualizações automáticas a partir das releases do GitHub.
- **puppeteer**: automação de navegador utilizada pelo processo principal (IPC `run-puppeteer`).
