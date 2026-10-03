# Violações iniciais de Detekt e KtLint

- **Data:** 2026-10-03
- **Categoria:** lint/backend
- **Comandos:** `./gradlew lint --no-daemon` e `./gradlew ktlintCheck --no-daemon`

## Mensagem

Após corrigir a compatibilidade do Detekt, a análise encontrou violações de newline, imports curinga, funções que retornavam constantes, exceções genéricas, exceções engolidas e bloco de teste vazio. O KtLint também encontrou linhas em branco indevidas no teste de contexto.

## Causa

O projeto ainda não seguia todas as regras padrão ativadas pelo Detekt e pelo KtLint. Algumas funções retornam constantes de propósito porque são métodos anotados pelo Spring e necessárias para mapear páginas.

## Solução

- Imports curinga foram substituídos por imports explícitos.
- `AuthPageController` recebeu uma supressão localizada para `FunctionOnlyReturningConstant`, pois as funções continuam sendo pontos de entrada do Spring.
- `JwtTokenProvider` passou a capturar `JwtException` e `IllegalArgumentException`, em vez de `Exception` genérica.
- `AIService` passou a usar `AIServiceException` para respostas inválidas do provedor.
- O teste de contexto recebeu um comentário útil e a formatação foi corrigida.
- Arquivos Kotlin foram formatados com `./gradlew ktlintFormat`.

## Arquivos e áreas afetadas

- Controllers Spring e mapeamento de páginas
- Segurança JWT
- Integração com a IA
- Exceções de domínio
- Testes Kotlin
- Formatação e regras de qualidade do backend

## Verificação

Os comandos abaixo passaram:

```text
./gradlew ktlintFormat --no-daemon
./gradlew lint --no-daemon
```

O `lint` executou KtLint e Detekt sem falhas.

## Recorrência

Novos métodos de controller que retornem apenas uma string podem ser classificados pelo Detekt como `FunctionOnlyReturningConstant`. Antes de suprimir a regra, confirme se a função é realmente exigida pelo framework e use a supressão no menor escopo possível.

## Orientação para IA

Leia este registro e `docs/CODIGO_LIMPO.md` antes de adicionar supressões, capturar exceções genéricas ou trocar exceções específicas por `RuntimeException`.
