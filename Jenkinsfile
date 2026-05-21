pipeline {
    agent any 
    environment {
       DOCKER_HUB_LOGIN = credentials('dockerhub')
    }
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
                sh 'docker build -t roxsross12/node-app-node-cf:1.0.0 .'
            }

        }

        stage('Deploy') {
            steps { 
                sh 'docker login -u $DOCKER_HUB_LOGIN_USR -p $DOCKER_HUB_LOGIN_PSW'
                sh 'echo "Pushing Docker Image..."'
                sh 'docker push roxsross12/node-app-node-cf:1.0.0'
            }

        }
    } // stages
    post {
        success { echo '✓ Build OK' }
        failure { echo '✗ Algo falló' }
    }
} //end pipeline