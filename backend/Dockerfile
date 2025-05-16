FROM openjdk:21-jdk-slim AS builder

RUN apt-get update && apt-get install -y curl \
    && curl -o /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /wait-for-it.sh \
    && apt-get remove -y curl \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY src src

RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test --no-daemon

# Copy the built jar to a clean image (multi-stage)
FROM openjdk:21-jdk-slim
WORKDIR /app

COPY --from=builder /app/build/libs/BoatApp-0.0.1-SNAPSHOT.jar ./app.jar
COPY --from=builder /wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "db:3306", "--", "java", "-jar", "/app/app.jar"]