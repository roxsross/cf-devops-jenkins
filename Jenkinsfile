pipeline {
    agent any 
    stages {
        stage('Check listar') {

            steps { 
                sh '''
                echo "contenido del workspace"
                ls -la
                '''
            }

        }

        stage('Install') {

            agent {
            docker { image 'node:24-alpine' }
            }
            steps { 
                sh 'npm install'

            }

        } // stage install

        stage('Test') {

            agent {
            docker { image 'node:24-alpine' }
            }
            steps { 
                sh 'npm test'

            }

        } // stage test

    } // stages

} //end pipeline