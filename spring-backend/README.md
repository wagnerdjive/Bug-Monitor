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

## SQL de Criação das Tabelas

Caso precise criar as tabelas manualmente, utilize as queries abaixo:

```sql
-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50),
    profile_image_url TEXT
);

-- Tabela de Projetos
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    owner_id INTEGER REFERENCES users(id)
);

-- Tabela de Eventos de Erro
CREATE TABLE error_events (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    message TEXT NOT NULL,
    stack_trace TEXT,
    level VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_info JSONB,
    breadcrumbs JSONB
);

-- Tabela de Convites
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- Tabela de Relacionamento Projeto-Usuário
CREATE TABLE project_users (
    project_id INTEGER REFERENCES projects(id),
    user_id INTEGER REFERENCES users(id),
    PRIMARY KEY (project_id, user_id)
);

-- Tabelas do Spring Session (JDBC)
CREATE TABLE SPRING_SESSION (
        PRIMARY_ID CHAR(36) NOT NULL,
        SESSION_ID CHAR(36) NOT NULL,
        CREATION_TIME BIGINT NOT NULL,
        LAST_ACCESS_TIME BIGINT NOT NULL,
        MAX_INACTIVE_INTERVAL INT NOT NULL,
        EXPIRY_TIME BIGINT NOT NULL,
        PRINCIPAL_NAME VARCHAR(100),
        CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
);

CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);

CREATE TABLE SPRING_SESSION_ATTRIBUTES (
        SESSION_PRIMARY_ID CHAR(36) NOT NULL,
        ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
        ATTRIBUTE_BYTES BYTEA NOT NULL,
        CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
        CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
);
```

## Configuração Automática

No arquivo `src/main/resources/application.properties`:
- `spring.jpa.hibernate.ddl-auto=update`: Cria e atualiza tabelas automaticamente.
- `spring.session.jdbc.initialize-schema=always`: Garante que as tabelas de sessão existam.
