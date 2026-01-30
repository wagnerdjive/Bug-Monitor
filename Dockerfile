FROM nginx:alpine

# Copia os ficheiros buildados do React
COPY dist /usr/share/nginx/html

# Configuração do Nginx: serve static + proxy /api para o backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]
