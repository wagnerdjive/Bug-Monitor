# Etapa de Build: Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de Build: Backend
FROM maven:3.8.4-openjdk-17-slim AS backend-build
WORKDIR /app
COPY spring-backend/pom.xml ./spring-backend/
COPY --from=frontend-build /app/spring-backend/src/main/resources/static ./spring-backend/src/main/resources/static
COPY spring-backend/src ./spring-backend/src
RUN mvn -f spring-backend/pom.xml clean package -DskipTests

# Etapa Final: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/spring-backend/target/*.jar app.jar
EXPOSE 5001
ENTRYPOINT ["java", "-jar", "app.jar"]
