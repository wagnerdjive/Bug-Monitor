# TechMonitor - Frontend

Este é o repositório do frontend da plataforma TechMonitor, desenvolvido com React, TypeScript e Vite.

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o ambiente:
   - O frontend está configurado para fazer proxy das chamadas `/api` para `http://localhost:5001`.

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Build para Produção

Para gerar os arquivos estáticos para o backend:
```bash
npm run build
```
Os arquivos serão gerados em `../spring-backend/src/main/resources/static`.
