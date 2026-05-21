pipeline {
    agent any 
    stages {
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

        } // stage build
        stage('Build') {
            steps { 
                sh 'echo "Building Docker Image..."'
                sh 'docker build -t my-node-app .'
            }

        }
    } // stages
    post {
        success { echo '✓ Build OK' }
        failure { echo '✗ Algo falló' }
    }
} //end pipeline