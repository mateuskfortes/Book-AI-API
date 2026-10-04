# Book AI API

Aplicação web para autenticação de usuários, leitura de um livro EPUB e geração de explicações por IA. O projeto reúne uma API Kotlin/Spring Boot, PostgreSQL, autenticação stateless com JWT e um frontend React servido pelos recursos estáticos do próprio backend. O frontend é pensado principalmente para execução dentro de uma WebView Android.

## Estado atual

O fluxo implementado é:

1. O usuário cria uma conta ou entra com email e senha.
2. A API armazena a senha com BCrypt e retorna um JWT.
3. O frontend salva o token em localStorage.
4. A rota /read valida o JWT e exibe o EPUB Moby-Dick usando react-reader, com opção de tela cheia.
5. Clientes autenticados podem chamar POST /api/ai/explanation, que encaminha a pergunta para a API Gemini.

Na rota `/`, visitantes sem sessão válida são redirecionados para `/signin`. Com um JWT válido, a página inicial mostra apenas um botão para abrir `/read`.

O leitor atual não chama o endpoint de IA nem envia o token salvo; essa integração ainda precisa ser conectada.

No modo tela cheia, o botão fica na barra superior. Para sair, use o botão voltar do celular, a seta voltar do navegador no desktop ou a tecla `Esc`; não há botão de saída dentro do leitor.

Como o front roda principalmente em uma WebView Android, a aplicação que hospeda a WebView deve encaminhar o botão voltar do Android ao histórico da WebView para preservar a navegação e a saída de tela cheia.

## Tecnologias

- Kotlin 2.3.21 e Java 21
- Spring Boot 4.1.0
- Spring Web, RestClient, Spring Security e Spring Data JPA
- PostgreSQL 16
- JWT com JJWT 0.12.3 e BCrypt
- React 18, Vite 6 e react-reader
- Docker e Docker Compose

## Estrutura

    src/main/kotlin/org/example/bookaiapi/
    ├── controller/       endpoints HTTP e páginas do frontend
    ├── dto/              modelos de entrada e saída
    ├── entity/           entidades JPA
    ├── exception/        exceções de autenticação
    ├── repository/       acesso ao PostgreSQL
    ├── security/         filtro JWT e configuração do Spring Security
    └── service/          regras de autenticação e chamada à Gemini

    frontend/
    ├── src/              aplicação React
    ├── public/sample/    EPUB usado no desenvolvimento
    └── vite.config.js    proxy local e saída do build

O código React é organizado por responsabilidade:

    frontend/src/
    ├── app/              composição das rotas e proteção de sessão
    ├── pages/            telas completas de cada rota
    ├── components/
    │   ├── global/       componentes reutilizados entre páginas
    │   ├── auth/         componentes dos formulários de autenticação
    │   └── reader/       controles específicos do leitor
    ├── hooks/            estado de sessão reutilizável
    ├── styles/           estilos globais
    └── utils/            acesso ao token local

    src/main/resources/
    ├── static/            build gerado do React e EPUB publicado
    └── templates/         páginas HTML antigas, sem uso no fluxo atual

Consulte [docs/ARQUITETURA.md](docs/ARQUITETURA.md), [docs/API.md](docs/API.md) e [docs/OPERACAO.md](docs/OPERACAO.md) para os detalhes.
Consulte também o [histórico de erros de build e lint](docs/erros/README.md) antes de investigar uma falha conhecida.

## Configuração rápida

Pré-requisitos: Java 21, Docker com Compose e Node.js com npm para desenvolver o frontend.

    cp .env.example .env

Preencha pelo menos JWT_SECRET, JWT_EXPIRATION e GEMINI_API_KEY. O segredo JWT precisa ter comprimento suficiente para HS512.

### API com PostgreSQL local

    ./gradlew bootRun

A aplicação usa localhost:5432 e o banco bookaidb por padrão. O Hibernate usa ddl-auto=update e cria ou atualiza a tabela users.

### Docker Compose de desenvolvimento

    docker compose -f compose.dev.yaml up --build

Esse compose publica a API em http://localhost:8080. O PostgreSQL fica disponível para a API no serviço postgres:5432 e, opcionalmente, no host pela porta definida em DB_PORT.

### Frontend

    cd frontend
    npm ci
    npm run dev

O Vite abre http://localhost:5173 e encaminha /api para http://localhost:8080, conforme frontend/vite.config.js. O Dockerfile também executa esse build automaticamente antes de compilar o backend.

Para gerar os arquivos servidos pelo Spring Boot:

    cd frontend
    npm run build

O build é gravado em src/main/resources/static/. Ao usar compose.dev.yaml, essa etapa é executada dentro do Docker e não precisa ser feita manualmente.

## Variáveis de ambiente

| Variável | Obrigatória | Uso | Padrão |
|---|---:|---|---|
| DB_HOST | não | Host do PostgreSQL | localhost |
| DB_PORT | não | Porta do PostgreSQL | 5432 |
| DB_NAME | não | Nome do banco | bookaidb |
| DB_USER | não | Usuário | postgres |
| DB_PASSWORD | não | Senha | postgres |
| JWT_SECRET | sim | Chave HS512 | — |
| JWT_EXPIRATION | sim | Validade em milissegundos | — |
| GEMINI_API_KEY | sim para IA | Chave da Gemini | — |
| EXPLANATION_AI_MODEL | não | Modelo da IA | gemini-2.5-flash-lite |
| SERVER_PORT | compose | Porta HTTP | padrão do Spring Boot |
| IMAGE_TAG | deploy | Tag da imagem GHCR | — |

Não comite .env, chaves Gemini, segredos JWT ou senhas reais.

## Comandos úteis

    ./gradlew bootRun
    ./gradlew bootJar
    ./gradlew lint
    cd frontend && npm run lint
    docker compose down

`./gradlew lint` executa KtLint e Detekt no backend. `npm run lint` executa ESLint
no frontend. Execute esses comandos antes de revisar ou publicar uma alteração.

O único teste automatizado presente é um teste de carregamento do contexto. Não há testes de contrato para endpoints, persistência, JWT ou integração Gemini.

## Deploy

O compose.yaml usa a imagem ghcr.io/mateuskfortes/book-ai-api:\${IMAGE_TAG}, conecta o backend à rede externa shared-proxy e não publica diretamente a porta do container. A rede precisa existir e o proxy reverso deve encaminhar para o serviço book-ai na porta definida por SERVER_PORT.

O Dockerfile faz build com JDK 21 e executa o JAR com JRE 21. Ele declara EXPOSE 8080; a porta efetiva também depende de SERVER_PORT.

## Pontos de atenção conhecidos

- As exceções de autenticação não têm handler HTTP global; o formato de erro depende do Spring.
- GET /api/auth/validate é público, mas exige o header Authorization.
- O React redireciona visitantes sem JWT válido de `/read` para `/signin`; a rota HTTP e o EPUB estático continuam públicos no Spring.
- O endpoint de IA exige autenticação, mas o frontend React não o chama.
- src/main/resources/templates/ contém a implementação antiga; Thymeleaf não está mais nas dependências.
- ddl-auto=update deve ser substituído por migrações versionadas em produção.

## Licença

Não há arquivo de licença no repositório. Defina uma licença antes de distribuir o projeto publicamente.
