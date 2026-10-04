# Import não utilizado ao adicionar validação da rota raiz

- **Data:** 2026-10-04
- **Categoria:** lint/frontend
- **Comando:** `cd frontend && npm run lint`

## Mensagem

`frontend/src/App.jsx:2:16 error 'Navigate' is defined but never used no-unused-vars`.

## Causa

`Navigate` permaneceu no import de React Router após a raiz deixar de usar um redirecionamento declarativo simples e passar a validar o JWT em um componente próprio.

## Solução

Remover `Navigate` do import de `react-router-dom`; o redirecionamento agora usa `useNavigate` dentro do componente de validação.

## Arquivos e áreas afetadas

- `frontend/src/App.jsx`
- Roteamento React e ESLint

## Verificação

`cd frontend && npm run lint` passou após remover o import não utilizado.

## Recorrência

Imports de componentes de navegação podem ficar obsoletos quando a forma de redirecionamento muda. O lint detecta nomes não utilizados.

## Orientação para IA

Depois de alterar a configuração de rotas, remova imports antigos e rode `npm run lint` no diretório `frontend`.
