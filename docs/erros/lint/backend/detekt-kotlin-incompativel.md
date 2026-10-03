# Detekt incompatível com a versão do Kotlin

- **Data:** 2026-10-03
- **Categoria:** lint/backend e dependências de build
- **Comando:** `./gradlew lint --no-daemon`

## Mensagem

O Detekt 1.23.8 falhou por incompatibilidade com a versão de Kotlin usada pelo projeto. A análise foi compilada para Kotlin 2.0.21, enquanto o projeto usa Kotlin 2.3.21.

## Causa

A versão `io.gitlab.arturbosch.detekt:1.23.8` não era compatível com o compilador Kotlin 2.3.21 configurado no projeto.

## Solução

O plugin foi alterado para:

```kotlin
id("dev.detekt") version "2.0.0-alpha.3"
```

Essa versão foi escolhida porque é compatível com Kotlin 2.3.21. A configuração permanece em `build.gradle.kts`, com `buildUponDefaultConfig`, `parallel` e a tarefa agregadora `lint`.

## Arquivos e áreas afetadas

- `build.gradle.kts`
- Dependências de build Gradle
- Kotlin, Detekt e tarefa de lint do backend

## Verificação

Depois da alteração, `./gradlew lint --no-daemon` avançou para a análise dos arquivos e reportou apenas violações reais de código, registradas em [violacoes-detekt-ktlint.md](violacoes-detekt-ktlint.md).

## Recorrência

Esse erro pode voltar quando Kotlin, Gradle ou Detekt forem atualizados separadamente. Antes de atualizar qualquer um deles, confira a matriz oficial de compatibilidade e execute `./gradlew lint`.

## Orientação para IA

Se o erro mencionar Kotlin metadata, versão de compilação incompatível ou falha durante a inicialização do Detekt, verifique primeiro a compatibilidade entre as versões antes de alterar regras ou suprimir avisos.
