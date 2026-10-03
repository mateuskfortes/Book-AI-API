# Erros iniciais de ESLint

- **Data:** 2026-10-03
- **Categoria:** lint/frontend
- **Comando:** `cd frontend && npm run lint`

## Mensagem

O lint inicial identificou configuração incompleta para JSX e uma variável não utilizada em `frontend/vite.config.js`. A regra de JSX precisava reconhecer componentes React e o parâmetro `command` não era usado.

## Causa

O frontend não possuía configuração de ESLint. O script foi adicionado antes de configurar os plugins e regras necessários para React, hooks e Vite.

## Solução

- Criado `frontend/eslint.config.js` com ESLint flat config, globals de navegador, regras recomendadas e plugins React, hooks e React Refresh.
- Adicionadas as dependências de desenvolvimento do ESLint em `frontend/package.json`.
- Atualizado `frontend/package-lock.json` com `npm install`.
- Removido o parâmetro não utilizado de `defineConfig` em `frontend/vite.config.js`.

## Arquivos e áreas afetadas

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/eslint.config.js`
- `frontend/vite.config.js`
- React, hooks, configuração Vite e dependências npm

## Verificação

`cd frontend && npm run lint` passou sem erros.

## Recorrência

Novas regras ou atualizações do ESLint podem exigir ajustes na configuração flat. Depois de alterar componentes, hooks ou a configuração do Vite, execute o lint do frontend antes de gerar o build publicado.

## Orientação para IA

Consulte primeiro `frontend/eslint.config.js` e este registro. Preserve a configuração flat e confirme se a regra está sendo aplicada à fonte correta antes de usar uma supressão.
