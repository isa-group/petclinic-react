const scanner = require('sonarqube-scanner');
// Replace with your project name key and token and 
// use the command 'node ./sonarqube/sonarscan.js' 
// on the frontend folder to analyze
// Don´t forget to define de environment varialbe SONAR_TOKEN (and restart the shell o vs. code)
console.log("USING AS TOKEN: ",process.env.SONAR_TOKEN)
scanner(
    {
        serverUrl: 'https://oitilo.us.es/sonar',
        token: process.env.SONAR_TOKEN,
        options: {
            'sonar.projectName': 'petclinic-react-frontend',
            'sonar.projectDescription': 'Here I can add a description of my project',
            'sonar.projectKey': 'petclinic-react-frontend',
            'sonar.projectVersion': '0.0.1',
            'sonar.login': process.env.SONAR_TOKEN,
            'sonar.exclusions': '',
            'sonar.sourceEncoding': 'UTF-8',
        }
    },
    () => process.exit()
)