# Multi-Stage Dockerfile for Spring Boot 3.3 + Java 21 (Root Repository Build)
# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven POM and sources from backend directory
COPY backend/pom.xml .
COPY backend/src ./src

# Build production JAR skipping unit tests
RUN apk add --no-cache maven && mvn clean package -DskipTests

# Stage 2: Ultra-Lightweight Production Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=builder /app/target/contractor-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
