# TechMonitor Backend - Explicação das Tabelas

Este projeto utiliza o Spring Data JPA com Hibernate para gerenciar o banco de dados PostgreSQL. A configuração `spring.jpa.hibernate.ddl-auto=update` garante que as tabelas sejam criadas automaticamente na primeira execução e atualizadas incrementalmente quando houver mudanças no código.

## Tabelas do Sistema

### 1. `users`
Armazena as informações dos usuários da plataforma.
- `id`: Identificador único (Long, Auto-increment).
- `username`: Nome de usuário único.
- `password`: Senha criptografada com BCrypt.
- `first_name` / `last_name`: Nome completo.
- `email`: Endereço de e-mail para notificações.
- `role`: Papel do usuário (`ADMIN` ou `USER`).
- `profile_image_url`: URL para a foto de perfil.

### 2. `projects`
Projetos criados pelos usuários para monitoramento de erros.
- `id`: Identificador único.
- `name`: Nome do projeto.
- `description`: Descrição opcional.
- `api_key`: Chave única usada pelo SDK para enviar erros.
- `owner_id`: Referência ao usuário que criou o projeto.

### 3. `error_events`
Registros de erros capturados pelo SDK.
- `id`: Identificador único.
- `project_id`: Referência ao projeto ao qual o erro pertence.
- `message`: Mensagem principal do erro.
- `stack_trace`: Rastro completo da pilha de execução.
- `level`: Nível do erro (`ERROR`, `WARN`, `INFO`).
- `timestamp`: Momento em que o erro ocorreu.
- `device_info`: JSON com informações do dispositivo/navegador.
- `breadcrumbs`: JSON com os passos que levaram ao erro.

### 4. `invitations`
Convites enviados para novos usuários.
- `id`: Identificador único.
- `email`: E-mail convidado.
- `token`: Token único de validação.
- `role`: Role que o usuário terá ao aceitar.
- `status`: Estado do convite (`PENDING`, `ACCEPTED`, `EXPIRED`).

### 5. `project_users` (Tabela de Relacionamento)
Gerencia quais usuários têm acesso a quais projetos (Muitos-para-Muitos).
- `project_id`: Referência ao projeto.
- `user_id`: Referência ao usuário.

### 6. `SPRING_SESSION` / `SPRING_SESSION_ATTRIBUTES`
Tabelas internas do Spring Session JDBC para gerenciar sessões de login de forma persistente no banco de dados, permitindo que o usuário continue logado mesmo após o reinício do servidor.

## Configuração Automática
No arquivo `src/main/resources/application.properties`:
- `spring.jpa.hibernate.ddl-auto=update`: Cria e atualiza tabelas automaticamente.
- `spring.session.jdbc.initialize-schema=always`: Garante que as tabelas de sessão existam.
