FROM maven:3.9.6-amazoncorretto-11-debian

WORKDIR /usr/src/backend

RUN java --version

COPY ./pom.xml .
COPY . .

RUN mvn clean install -Dmaven.test.skip=true

CMD ["mvn", "spring-boot:run"]