# Histórico de erros de build e lint

Este diretório registra falhas encontradas durante build, formatação, lint e validações diretamente relacionadas à qualidade do código.

## Objetivo

Antes de investigar um erro novo, a IA deve consultar este diretório usando a mensagem principal, o comando executado e a área afetada. O histórico evita repetir diagnósticos e preserva decisões que podem ser necessárias quando dependências, versões ou configurações forem alteradas.

## Organização

- `build/`: erros do Gradle, compilação, empacotamento e build do frontend.
- `lint/backend/`: erros de KtLint e Detekt no Kotlin.
- `lint/frontend/`: erros de ESLint no React, JavaScript e configuração do Vite.

Cada categoria pode manter um `README.md` com índice e arquivos separados para problemas recorrentes ou relevantes.

## Quando registrar

Registre um erro sempre que qualquer comando de build ou lint falhar, mesmo que a correção seja simples. O registro deve ser criado na mesma alteração que corrige o problema, antes do relatório final da tarefa.

Não registre apenas a mensagem final. Preserve a causa, a solução, os arquivos envolvidos e as áreas que precisam ser revistas se o erro voltar.

## Formato obrigatório

Cada registro deve conter:

1. **Identificação:** título curto, data e categoria.
2. **Comando:** comando completo que falhou.
3. **Mensagem:** trecho suficiente para localizar o erro sem incluir segredos.
4. **Causa:** motivo técnico confirmado ou hipótese ainda não confirmada.
5. **Solução:** alteração aplicada e motivo da escolha.
6. **Arquivos e áreas afetadas:** código, configuração, dependências, frontend, backend, Docker ou documentação.
7. **Verificação:** comandos executados depois da correção e resultado.
8. **Recorrência:** condições que podem fazer o problema voltar.
9. **Orientação para IA:** primeira consulta ou diagnóstico recomendado no futuro.

## Regras de segurança

- Nunca copie tokens, senhas, chaves, conteúdo de `.env` ou credenciais para o histórico.
- Redija mensagens de erro que contenham dados sensíveis antes de registrá-las.
- Não trate um erro como resolvido sem registrar uma verificação reproduzível.

## Histórico inicial

- [Erros de Detekt e KtLint do backend](lint/backend/violacoes-detekt-ktlint.md)
- [Incompatibilidade de versão do Detekt](lint/backend/detekt-kotlin-incompativel.md)
- [Erros de lint do frontend](lint/frontend/erros-eslint-iniciais.md)
