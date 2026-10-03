# Frontend build stage
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Backend build stage
FROM gradle:8.14-jdk21 AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
COPY gradlew ./
COPY src ./src
COPY --from=frontend-builder /app/src/main/resources/static ./src/main/resources/static
RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-noble
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
