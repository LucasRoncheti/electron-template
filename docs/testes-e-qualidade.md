# Testes e qualidade

## Testes automatizados
- Ainda não há suíte de testes configurada. O script `npm test` retorna um placeholder e pode ser substituído por frameworks como **Vitest** (para o front-end) e **Jest** ou **Mocha** (para utilitários Node/Electron).
- O comando `npm run puppeteer:test` foi definido, mas o arquivo `scripts/puppeteer-test.mjs` não está presente. Crie esse script para validar fluxos fim a fim ou geração de PDFs com o Puppeteer.

## Boas práticas sugeridas
- Adicione **lint** e **formatação** no front-end (por exemplo, `npm run lint`/`npm run format`) reutilizando a configuração do Vite/ESLint já existente em `frontend/`.
- Automatize builds de integração contínua (CI) para garantir que `npm run build` continue funcionando após mudanças.
- Para testar o auto-update, publique uma release com versionamento semântico e verifique os logs `[AUTO-UPDATER]` emitidos pelo processo principal.

## Checklist manual mínimo
1. Interface carrega no Electron em modo desenvolvimento (Vite + `npm run electron:dev`).
2. Geração de PDF via IPC `run-puppeteer` salva o arquivo em um diretório acessível (Documentos no build, `files/` na raiz em dev).
3. Build de produção finaliza sem erros e gera instalador na pasta `dist/`.
