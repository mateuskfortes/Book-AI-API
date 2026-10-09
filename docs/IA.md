# Contexto para IAs e agentes de código

Este documento descreve o projeto de forma compacta e operacional para uma IA que precise responder perguntas, revisar código ou implementar mudanças. As regras de qualidade e comentários estão em docs/CODIGO_LIMPO.md. O histórico de falhas de build e lint está em [docs/erros/](erros/README.md).

## Resumo em uma frase

Book AI é um monólito Kotlin/Spring Boot com PostgreSQL, JWT e integração Gemini, que serve um frontend React para autenticação e leitura de um EPUB, pensado principalmente para execução dentro de uma WebView Android.

## Fluxo principal

    Browser
      ├─ GET /, /signin, /signup, /read
      │    └─ Spring encaminha para static/index.html
      ├─ POST /api/auth/signup ou /api/auth/signin
      │    └─ AuthService → UserRepository → BCrypt → JwtTokenProvider
      └─ POST /api/ai/explanation + Bearer JWT
           └─ SecurityFilterChain → JwtAuthenticationFilter → AIService → Gemini

## Fonte de verdade por assunto

| Assunto | Arquivos principais |
|---|---|
| Rotas HTTP | controller/AuthController.kt, controller/AIController.kt |
| Páginas web | controller/AuthPageController.kt, frontend/src/app/App.jsx, frontend/src/pages/ |
| Autenticação | service/AuthService.kt, security/JwtTokenProvider.kt, security/JwtAuthenticationFilter.kt |
| Autorização e CORS | security/SecurityConfig.kt |
| Usuários | entity/User.kt, repository/UserRepository.kt |
| Contratos JSON | dto/AuthDTO.kt, dto/AIDTO.kt |
| Gemini | service/AIService.kt |
| Configuração | src/main/resources/application.properties, .env, compose.yaml, compose.dev.yaml |
| Frontend compilado | src/main/resources/static/ |

## Contratos que uma IA deve preservar

### Autenticação

POST /api/auth/signup e POST /api/auth/signin recebem email e password. A resposta contém token, email e userId.

O JWT usa HS512. O subject é o ID do usuário e existe uma claim email. A expiração é configurada por JWT_EXPIRATION em milissegundos.

### Validação

GET /api/auth/validate recebe Authorization: Bearer <token> e retorna { "valid": true|false }. O endpoint é público na autorização, embora o controller exija o header.

### IA

POST /api/ai/explanation recebe { "question": "..." } e retorna { "explanation": "..." }. O endpoint requer autenticação. O backend envia a pergunta para /v1beta/interactions da API Gemini com model e input.

## Segurança

- Senhas são armazenadas com BCrypt; nunca retorne ou registre o campo password.
- O JWT é assinado com segredo configurado por ambiente; nunca coloque segredo em código, documentação de exemplo ou logs.
- O filtro JWT valida assinatura e expiração antes de instalar a autenticação no contexto.
- Rotas não listadas como públicas em SecurityConfig exigem autenticação.
- CORS é uma lista explícita de origens. Ao adicionar frontend, atualize a configuração conscientemente.
- O token é salvo em localStorage pelo React atual. Uma mudança de armazenamento altera o modelo de segurança e precisa ser documentada.
- Na rota `/`, visitantes sem JWT válido são redirecionados para `/signin`; com JWT válido, a página mostra somente um botão para `/read`.
- A rota React `/read` valida `book-ai-token` por `GET /api/auth/validate` e redireciona para `/signin` se ausente ou inválido. Quando a API não responde, mantém o token e falha de forma fechada para a tela de login.

## Como raciocinar sobre mudanças

### Fluxo obrigatório antes de alterar o projeto

Toda implementação deve seguir esta sequência, sem pular etapas:

0. **Verificar coerência:** confira se o pedido é coerente com o objetivo do projeto, instruções anteriores, estado atual e escopo informado. Se soar incoerente, contraditório, ambíguo ou incompatível, questione o usuário e aguarde esclarecimento antes de estudar, editar ou executar qualquer ação.
1. **Estudar:** depois de confirmar a coerência, leia a documentação relacionada e o código envolvido. Entenda o objetivo, o comportamento atual, as dependências, as integrações, os impactos de segurança, banco, configuração, frontend, Docker e documentação.
2. **Resumir:** apresente ao usuário o entendimento do objetivo, a solução proposta, os arquivos que serão alterados, alternativas, riscos, limitações, verificações planejadas e dúvidas relevantes.
3. **Aguardar aprovação:** não crie, edite ou remova arquivos e não execute ações que alterem o repositório até receber aprovação explícita do usuário. Leituras, inspeções, diagnósticos e validações sem mutação continuam permitidos.
4. **Implementar:** depois da aprovação, aplique somente a solução aprovada e preserve as mudanças existentes no working tree.
5. **Verificar e documentar:** execute as verificações adequadas, compare o comportamento com a documentação e documente qualquer novo contrato, fluxo, configuração, dependência, decisão arquitetural ou limitação que possa mudar no futuro.
6. **Relatar:** informe o que foi alterado, por quê, quais verificações foram executadas, os resultados, riscos residuais e próximos passos.

Se o usuário alterar o escopo depois do resumo, volte à etapa 1 para estudar o novo escopo antes de implementar.

### Consulta e registro de erros de build e lint

Antes de investigar uma falha de build ou lint, consulte `docs/erros/` usando a mensagem principal, o comando e a ferramenta envolvida. Compare a área afetada com os registros anteriores e reaproveite a solução somente depois de confirmar que as versões e o contexto continuam compatíveis.

Toda falha de build ou lint deve ser registrada na mesma alteração que a corrige. O registro deve ficar na categoria correta e conter comando, mensagem sem segredos, causa confirmada ou hipótese, solução, arquivos e áreas afetadas, verificação, risco de recorrência e orientação para a próxima IA. Atualize o índice da categoria quando necessário.

Esse histórico é parte da documentação operacional do projeto. Não apague registros antigos quando uma solução for substituída; atualize o registro explicando a mudança de contexto ou crie um novo registro relacionado.

### Regra de documentação contínua

Antes de implementar qualquer funcionalidade, localize e leia a documentação relacionada ao componente. Use README.md para operação geral, docs/API.md para contratos HTTP, docs/ARQUITETURA.md para limites entre componentes, docs/OPERACAO.md para execução e deploy e este arquivo para decisões que afetam agentes.

Toda funcionalidade que introduzir um contrato, fluxo, configuração, dependência, decisão arquitetural ou limitação que possa mudar no futuro deve ser documentada na mesma alteração. A documentação deve explicar o comportamento atual, os arquivos envolvidos, as dependências e os pontos que precisam ser revisados caso o comportamento mude.

Depois de implementar, compare código e documentação e atualize ambos quando houver divergência. Não deixe conhecimento necessário para futuras alterações apenas em uma conversa ou no histórico do agente.

### Se a mudança alterar uma rota

Atualize o controller, o DTO, docs/API.md, os exemplos do README e a lista de autorização em SecurityConfig. Verifique também CORS e o frontend consumidor.

### Se a mudança alterar o JWT

Analise geração, parsing, filtro, endpoint de validação e expiração. Tokens antigos podem deixar de ser aceitos quando o segredo, algoritmo ou claims mudarem.

### Se a mudança alterar o frontend

Edite frontend/src. O build do Vite escreve em src/main/resources/static; não use os arquivos empacotados como fonte. Confira o proxy, as rotas de fallback e o EPUB.

A navegação React usa React Router 6 em `frontend/src/app/App.jsx`, com `BrowserRouter` configurado em `frontend/src/main.jsx`. Mantenha páginas completas em `frontend/src/pages/`, componentes reutilizados em `components/global/` e componentes específicos junto à área em `components/auth/` ou `components/reader/`. O estado da sessão fica em `frontend/src/hooks/useValidatedSession.js` e as operações de token em `frontend/src/utils/tokenStorage.js`.

O frontend roda principalmente dentro de uma WebView Android. Preserve a navegação da History API e a saída de tela cheia pelo botão voltar; o aplicativo hospedeiro deve encaminhar o voltar do Android ao histórico da WebView. Na rota `/`, visitantes são redirecionados para `/signin`, enquanto uma sessão válida vê somente o botão para `/read`. A rota `/read` exige JWT válido no React e manda sessões ausentes ou inválidas para `/signin`. Caminhos desconhecidos exibem uma página de não encontrado quando o frontend é servido. Ao adicionar rotas, atualize o controller de páginas Spring para permitir acesso direto à URL.

O leitor usa a Fullscreen API em `frontend/src/pages/ReaderPage.jsx`. O botão inicia o modo tela cheia; o retorno deve continuar sendo feito pelo voltar do navegador ou do celular, sem adicionar um botão de saída. Alterações nesse fluxo devem preservar o tratamento de `fullscreenchange` e do histórico da rota `/read`. O índice abre pelo botão pequeno no topo da área de leitura, disponível também em tela cheia; a área central permanece livre para selecionar texto. Ao personalizar `readerStyles` do `react-reader`, parta de `ReactReaderStyle`: a prop substitui o objeto inteiro e os estilos de camada padrão mantêm o índice fechado atrás da página.

### Se a mudança alterar o banco

Atualize a entidade, o repositório, a configuração e a documentação de ambiente. Considere que ddl-auto=update não substitui migrações em produção.

### Se a mudança alterar a Gemini

Revise o formato real da resposta desserializada em GeminiResponse, tratamento de falhas, timeout, limite de entrada e custo. Não suponha que qualquer erro do provedor tenha o mesmo formato.

## Dívidas técnicas já observadas

1. O frontend não envia o JWT para chamadas posteriores e não faz logout ou renovação.
2. O guard React protege a navegação de `/read`, mas o endpoint da página e o EPUB permanecem públicos no Spring.
3. O frontend não usa a explicação por IA.
4. Exceções de autenticação não possuem contrato HTTP global.
5. A chamada Gemini não define timeout, retry ou tratamento específico de erro.
6. O proxy Vite e o compose dev usam a API em 8080.
7. O compose dev usa DB_PORT apenas para publicar o banco no host; a API acessa postgres:5432 internamente.
8. Templates Thymeleaf antigos permanecem no repositório, embora a dependência tenha sido removida.
9. Existe apenas um teste de carregamento do contexto.

## Checklist de revisão por IA

- A mudança mantém o build Gradle e o build do frontend coerentes?
- Todas as classes e funções do trecho analisado possuem comentários úteis sobre propósito, contrato ou conhecimento importante?
- Os comentários explicam decisões e invariantes sem repetir o código?
- Nomes e responsabilidades tornam o fluxo compreensível?
- O novo endpoint está documentado e protegido corretamente?
- Entradas são validadas e erros têm resposta previsível?
- Nenhum segredo aparece no diff, nos logs ou nos exemplos?
- O código usa os DTOs e padrões existentes?
- O comportamento local, Docker e produção continuam descritos corretamente?
- A alteração impacta arquivos gerados em static/?
- Há risco de quebrar tokens emitidos ou dados existentes?
- O lint do backend (`./gradlew lint`) e o lint do frontend (`cd frontend && npm run lint`) passam?

## Prompt inicial recomendado

Ao delegar uma tarefa a uma IA, forneça:

    Leia AGENTS.md, docs/IA.md e a documentação da API antes de alterar o projeto.
    Preserve mudanças existentes no working tree.
    Explique o impacto arquitetural da mudança, edite apenas os arquivos necessários,
    atualize a documentação afetada e informe as verificações executadas.
    Não exponha segredos nem faça chamadas externas reais sem instrução explícita.
