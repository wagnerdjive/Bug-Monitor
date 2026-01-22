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

### Comunicação com o Backend (Proxy e URL)
O frontend está configurado para encaminhar chamadas de API para o backend.

#### Desenvolvimento (Local)
Se você alterar a porta do backend (ex: para 8081), atualize o `target` no arquivo `vite.config.ts`:
```typescript
proxy: {
  "/api": {
    target: "http://localhost:8080", // Altere aqui se o backend mudar de porta
    ...
  }
}
```

#### Produção / Deploy
Em produção, as chamadas são feitas para a URL onde o backend está hospedado.
1. Se o frontend e o backend estiverem no mesmo domínio, o proxy configurado no servidor de produção (como o `server.js` incluído) cuidará disso.
2. Caso precise apontar para uma URL externa, você pode configurar a variável de ambiente `VITE_API_URL` no seu provedor de deploy ou em um arquivo `.env` na pasta `client/`:
   - Exemplo no `.env`: `VITE_API_URL=https://api.seudominio.com`
   - No código, as chamadas utilizam a URL base configurada em `client/src/lib/queryClient.ts`.

## Build para Produção
Para gerar os arquivos estáticos para deploy:
```bash
npm run build
```
O resultado estará na pasta `dist/`.
