# Erros de lint do backend

O lint do backend é executado por `./gradlew lint`, que combina KtLint e Detekt.

Ao corrigir uma falha, verifique se a solução respeita Kotlin, Spring, JPA e as regras de comentários definidas em `docs/CODIGO_LIMPO.md`.

## Registros

- [Incompatibilidade entre Detekt e Kotlin](detekt-kotlin-incompativel.md)
- [Violações iniciais de Detekt e KtLint](violacoes-detekt-ktlint.md)
