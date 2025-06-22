# Используем образ с поддержкой Java 23
FROM eclipse-temurin:23.0.2_7-jre-ubi9-minimal

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем JAR-файл вашего Spring-приложения в контейнер
COPY build/libs/sage-0.0.1-SNAPSHOT.jar app.jar

# Открываем порт, на котором будет работать ваше приложение
EXPOSE 8080

# Команда для запуска вашего приложения
ENTRYPOINT ["java", "-jar", "app.jar"]