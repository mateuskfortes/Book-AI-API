# Código limpo e comentários

Estas regras adaptam princípios de Clean Code ao Kotlin, JavaScript/React e ao desenho atual do Book AI. Elas orientam novas alterações e a manutenção do código existente.

## Princípios

### Nomes que expressem intenção

Use nomes completos, pronunciáveis e pesquisáveis. Classes devem representar conceitos; funções devem indicar a ação ou consulta realizada; variáveis devem revelar o significado do valor. Evite abreviações, nomes genéricos, siglas sem contexto e números ou strings sem nome.

### Responsabilidade única

Cada classe, função e módulo deve ter uma responsabilidade clara e um motivo principal para mudar. Separe transporte HTTP, regras de negócio, persistência, segurança e integração externa.

### Funções pequenas e focadas

Uma função deve operar em um único nível de abstração e fazer uma coisa. Reduza ramificações, argumentos e efeitos colaterais. Extraia uma função quando isso der um nome melhor a uma decisão ou etapa de negócio.

### Coesão e baixo acoplamento

Mantenha juntos os dados e comportamentos que mudam pelos mesmos motivos. Dependa de abstrações quando isso facilitar testes ou substituir integrações. Evite que controllers conheçam detalhes de banco ou de provedores externos.

### Não repetir conhecimento

Não duplique regras, formatos, nomes de configuração ou conversões. Extraia a regra compartilhada quando ela representar o mesmo conhecimento; não crie abstrações apenas para eliminar duas linhas coincidentais.

### Efeitos colaterais explícitos

Deixe claro quando uma função grava no banco, altera estado, envia uma requisição, usa cache ou depende de horário. Não esconda mutações em funções que parecem consultas.

### Validação nas fronteiras

Valide entradas HTTP, configurações, respostas externas e dados persistidos nas fronteiras do sistema. Erros devem ser previsíveis, conter contexto suficiente e não revelar segredos.

### Falhe cedo e trate erros com contexto

Não ignore exceções. Diferencie erro de entrada, autenticação, persistência e dependência externa. Use mensagens úteis para diagnóstico e mantenha um contrato HTTP estável.

### Configuração fora do código

Segredos, URLs, origens CORS, portas, nomes de modelo e limites operacionais devem vir de configuração. Dê nomes às constantes que representem valores fixos do domínio.

### Evite complexidade prematura

Implemente o comportamento necessário, mantenha a solução simples e extraia abstrações quando houver uma responsabilidade real. Não adicione generalizações, camadas ou dependências sem benefício claro.

### Boy Scout Rule

Ao tocar em um trecho, deixe-o mais claro e consistente quando isso for seguro e estiver no escopo. Não misture uma grande refatoração não relacionada com uma funcionalidade.

## Comentários obrigatórios

Toda classe e toda função do projeto deve ter um comentário curto e útil. A regra vale para Kotlin, JavaScript/React e demais linguagens do projeto. Ao criar ou alterar código, adicione ou atualize o comentário correspondente.

Use KDoc, JSDoc ou comentário de implementação conforme o contexto. O comentário deve registrar pelo menos o conhecimento que não é óbvio apenas pelo nome:

- propósito e responsabilidade;
- contrato de entrada e saída;
- invariante ou regra de negócio;
- efeito colateral ou dependência externa;
- motivo de uma decisão incomum;
- requisito de segurança, concorrência, desempenho ou compatibilidade;
- condição que exige revisão futura.

Exemplo Kotlin:

    /**
     * Gera um token stateless cujo subject é o ID persistido do usuário.
     * A validade é configurada em milissegundos para manter compatibilidade
     * com JWT_EXPIRATION.
     */
    fun generateToken(userId: Long, email: String): String

Exemplo JavaScript:

    /**
     * Atualiza a URL sem recarregar o React para preservar o estado da sessão.
     * As rotas precisam continuar sendo tratadas pelo App.
     */
    function navigate(path) { ... }

Não use comentários para repetir literalmente o nome da classe ou da função, descrever cada linha ou manter código morto. Quando o código ficar mais claro com uma renomeação ou extração, prefira isso e use o comentário para explicar o porquê.

TODOs devem explicar o motivo, o contexto e, quando possível, uma referência ou condição de remoção. Comentários desatualizados devem ser corrigidos ou removidos na mesma alteração.

## Revisão antes de concluir

- Os nomes revelam a intenção?
- Cada classe e função do trecho analisado tem comentário útil?
- O comentário descreve conhecimento que precisa ser preservado?
- A função tem uma responsabilidade clara?
- Há duplicação ou regra escondida em mais de um lugar?
- Efeitos colaterais e dependências externas estão claros?
- Entradas e falhas estão tratadas nas fronteiras?
- Configurações e segredos ficaram fora do código?
- A documentação do sistema foi atualizada quando o comportamento mudou?

## Referências

- Clean Code, Robert C. Martin: https://www.oreilly.com/library/view/clean-code-a/9780136083238/toc.xhtml
- Convenções oficiais de Kotlin: https://kotlinlang.org/docs/coding-conventions.html
- Guia de estilo Java do Google, seção de comentários: https://google.github.io/styleguide/javaguide.html#s4.8.6-comments
- Boas práticas de documentação do Google: https://google.github.io/styleguide/docguide/best_practices.html
