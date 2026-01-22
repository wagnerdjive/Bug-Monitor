# TechMonitor - Backend

Este é o repositório do backend da plataforma TechMonitor, desenvolvido com Spring Boot e Java.

## Configuração

1. Certifique-se de ter o Java 17+ e Maven instalados.
2. Configure o banco de dados PostgreSQL conforme as instruções no `README.md` da raiz (ou crie as tabelas manualmente).
3. Ajuste as credenciais no arquivo `src/main/resources/application.properties`.

## Execução

Inicie a aplicação:
```bash
mvn spring-boot:run
```

## Build

Para gerar o arquivo JAR executável:
```bash
mvn clean package -DskipTests
```
O arquivo será gerado na pasta `target/`.
