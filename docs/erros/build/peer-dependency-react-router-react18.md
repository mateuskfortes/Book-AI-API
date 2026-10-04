# Conflito de peer dependency ao instalar React Router 8

- **Data:** 2026-10-04
- **Categoria:** build/dependências frontend

## Comando

`cd frontend && npm install react-router@^8.3.1`

## Mensagem

`npm ERR! ERESOLVE unable to resolve dependency tree`: o React Router 8.4.0 requer `react >=19.2.7`, mas o projeto usa React 18.3.1.

## Causa

A faixa `^8.3.1` permitiu ao npm selecionar React Router 8.4.0, cuja faixa de peer dependency não inclui a versão React usada pelo Book AI.

## Solução

Usar `react-router-dom@^6.30.1`, compatível com a arquitetura React 18 existente. A instalação foi concluída sem forçar ou ignorar peer dependencies. A implementação usa a API declarativa com `BrowserRouter`, `Routes`, `Route`, `Link` e `useNavigate`.

## Arquivos e áreas afetadas

- `frontend/package.json` e `frontend/package-lock.json`
- Rotas e navegação React em `frontend/src`
- `docs/IA.md`

## Verificação

- `cd frontend && npm install react-router-dom@^6.30.1`: concluído.
- `cd frontend && npm run lint`: passou.
- `cd frontend && npm run build -- --outDir /tmp/book-ai-frontend-build`: passou; Vite emitiu um aviso de chunk JavaScript acima de 500 kB.

## Recorrência

Uma atualização da dependência para a linha 8 volta a exigir React 19 ou posterior. Verifique as peer dependencies antes de atualizar o major do roteador ou do React.

## Orientação para IA

Antes de atualizar React Router, confira as versões de React em `frontend/package.json` e compare-as com as peer dependencies do major escolhido. Não use `--force` ou `--legacy-peer-deps` para contornar incompatibilidade de runtime.
