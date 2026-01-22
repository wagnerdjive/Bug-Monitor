# TechMonitor - Frontend

Este é o repositório do frontend da plataforma TechMonitor, desenvolvido com React, TypeScript e Vite.

## Como Rodar o Frontend

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Comandos para Rodar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Como Trocar a Porta
A porta de desenvolvimento padrão é **5000**. Para alterar:

1. Abra o arquivo `vite.config.ts`.
2. Localize a seção `server` e altere a propriedade `port`:
```typescript
server: {
  port: 5000, // Altere aqui para a porta desejada
  ...
}
```

### Comunicação com o Backend (Proxy)
O frontend está configurado para encaminhar chamadas de API para o backend. Se você alterar a porta do backend (ex: para 8081), lembre-se de atualizar o `target` no arquivo `vite.config.ts`:
```typescript
proxy: {
  "/api": {
    target: "http://localhost:8080", // Altere aqui se o backend mudar de porta
    ...
  }
}
```

## Build para Produção
Para gerar os arquivos estáticos para deploy:
```bash
npm run build
```
O resultado estará na pasta `dist/`.
