# Documentação do projeto

Esta pasta reúne as informações essenciais para iniciar o desenvolvimento e a publicação do aplicativo **Electron + Vite + Puppeteer** deste repositório. A aplicação principal roda em Electron, consome uma interface React/Vite e inclui automação com Puppeteer e atualização automática via `electron-updater`.

## Conteúdo
- [`ambiente.md`](./ambiente.md): pré-requisitos e instalação das dependências.
- [`estrutura.md`](./estrutura.md): visão geral das pastas e principais arquivos.
- [`build-e-release.md`](./build-e-release.md): como gerar builds locais e publicar releases.
- [`testes-e-qualidade.md`](./testes-e-qualidade.md): recomendações iniciais para testes e validação.

## Guia rápido
1. Instale Node.js LTS (recomendado 20.x) e o npm.
2. Instale dependências na raiz e no frontend:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Rode o front-end Vite (porta padrão 5173):
   ```bash
   cd frontend
   npm run dev
   ```
4. Em outro terminal, suba o Electron apontando para o servidor Vite:
   ```bash
   npm run electron:dev
   ```
5. Para gerar o build de produção completo (frontend + instalador Electron):
   ```bash
   npm run build
   ```

Para mais detalhes e observações, consulte os demais arquivos desta pasta.
