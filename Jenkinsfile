pipeline {
    agent any
    
    environment {
        AWS_REGION = 'eu-north-1'
        STACK_NAME = 'first-node-app'
        AWS_ACCESS_KEY_ID = credentials('97f641eb-7532-4c61-9c06-c04ee8d6a08f')
        AWS_SECRET_ACCESS_KEY = credentials('97f641eb-7532-4c61-9c06-c04ee8d6a08f')
    }

    stages {
        stage('Setup AWS CLI') {
            steps {
                script {
                    // Configure AWS CLI with the credentials
                    bat '''
                    aws configure set aws_access_key_id %AWS_ACCESS_KEY_ID%
                    aws configure set aws_secret_access_key %AWS_SECRET_ACCESS_KEY%
                    aws configure set default.region %AWS_REGION%
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Run SAM build
                    bat 'sam build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Run SAM deploy and automatically confirm with "y"
                   bat 'echo y | sam deploy --config-file samconfig.toml'
                
                }
            }
        }
    }
}
