# Instruções para agentes de IA

Este arquivo é o contexto operacional mínimo para qualquer agente que analise ou altere o repositório. Leia também docs/IA.md antes de executar mudanças que envolvam arquitetura, segurança, API ou deploy. Para regras de qualidade e comentários, consulte docs/CODIGO_LIMPO.md.

## Objetivo do produto

Book AI é uma aplicação web para autenticar usuários, ler um EPUB e solicitar explicações a um modelo Gemini. O backend é Kotlin/Spring Boot; o frontend é React compilado para src/main/resources/static/.

## Mapa rápido

- src/main/kotlin/.../controller: endpoints REST e encaminhamento das páginas.
- src/main/kotlin/.../service: regras de autenticação e integração Gemini.
- src/main/kotlin/.../security: JWT, filtro e autorização.
- src/main/kotlin/.../repository e entity: persistência de usuários.
- frontend/src: fonte do React.
- frontend/vite.config.js: servidor Vite, proxy e destino do build.
- compose*.yaml: ambientes Docker.
- src/main/resources/static: artefato gerado do frontend e EPUB publicado.
- docs/erros: histórico de falhas de build e lint para consulta antes de novos diagnósticos.

## Regras de trabalho

1. Preserve mudanças existentes no working tree. Antes de editar, verifique git status.
2. Não exponha nem substitua valores de .env, chaves Gemini, senhas ou segredos JWT.
3. Não trate src/main/resources/static/assets como fonte; ele é saída gerada. Edite frontend/src e gere o build quando a tarefa pedir uma alteração publicada.
4. Não reintroduza Thymeleaf sem uma decisão explícita. As páginas em src/main/resources/templates são legado; o fluxo atual usa React.
5. Mudanças no contrato HTTP devem atualizar docs/API.md, exemplos e este contexto.
6. Mudanças de segurança devem ser revisadas junto com SecurityConfig, JwtAuthenticationFilter, JwtTokenProvider e AuthService.
7. Não invente autenticação no frontend: hoje /read é pública e o React apenas salva o token, sem enviá-lo a chamadas posteriores.
8. Não faça chamadas reais à Gemini ou ao banco de produção durante a análise.
9. Use ./gradlew para tarefas Gradle e npm dentro de frontend. Evite alterar lockfiles sem necessidade.
10. Depois de mudanças, relate arquivos modificados, motivo, verificações executadas e limitações.
11. Para qualquer pedido de alteração, siga a sequência obrigatória descrita em docs/IA.md: verificar coerência, estudar, resumir, aguardar aprovação, implementar, verificar/documentar e relatar.
12. Se o pedido parecer incoerente, contraditório, ambíguo ou incompatível com o objetivo do projeto, questione o usuário antes de estudar, editar ou executar qualquer ação.
13. Antes da aprovação, só faça leituras, inspeções, diagnósticos e validações sem mutação. Não edite, remova, crie arquivos nem execute ações que alterem o repositório.
14. Siga docs/CODIGO_LIMPO.md: use nomes que expressem intenção, responsabilidades claras, funções focadas, baixo acoplamento, validação nas fronteiras e configuração fora do código.
15. Toda classe e toda função do projeto deve ter um comentário curto e útil. Ao criar ou alterar código, adicione ou atualize esse comentário. Use KDoc, JSDoc ou comentário de implementação para registrar propósito, contrato, invariante, efeito colateral, decisão incomum ou requisito que possa ser esquecido.
16. Não escreva comentários redundantes que apenas repitam o nome do código. Se o comentário ficou necessário para explicar uma função grande ou confusa, avalie também separar responsabilidades ou melhorar os nomes.
17. Ao alterar código comentado, revise os comentários relacionados e remova ou atualize qualquer comentário que tenha ficado incorreto.
18. Antes de investigar um erro de build ou lint, consulte `docs/erros/` pela mensagem, comando e área afetada.
19. A cada erro de build ou lint, registre a ocorrência em `docs/erros/` na mesma alteração que corrigir o problema. Inclua comando, mensagem sem segredos, causa, solução, arquivos, áreas afetadas, verificação, recorrência e orientação para futuras IAs.
20. Não considere um erro resolvido sem registrar como ele foi reproduzido e verificado. Se a causa ainda for hipótese, marque-a claramente no registro.

## Comandos de referência

    ./gradlew bootRun
    ./gradlew bootJar
    ./gradlew lint
    cd frontend && npm ci && npm run build
    cd frontend && npm run lint
    docker compose -f compose.dev.yaml up --build

## Limitações conhecidas

- Não existe @RestControllerAdvice; erros de autenticação e de integração podem não ter contrato estável.
- /api/auth/validate é público, mas exige o header Authorization.
- /api/ai/explanation é protegido, porém o frontend atual não o chama.
- O proxy Vite e o compose de desenvolvimento usam a API em 8080.
- DB_PORT publica o banco no host; a API usa postgres:5432 dentro da rede Docker.
- JPA usa ddl-auto=update; não há migrações versionadas.
