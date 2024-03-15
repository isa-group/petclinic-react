FROM maven:3.9.6-amazoncorretto-11-debian

WORKDIR /usr/src/backend

COPY ./pom.xml .
COPY . .

RUN mvn -f ./pom.xml clean package -Dmaven.test.skip=true

ENTRYPOINT ["java","-jar","/usr/src/backend/target/petclinic.jar"]