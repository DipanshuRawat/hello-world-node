pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'dipanshurawat/hello-world-node:latest'
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-cred'
        DOCKER_CREDENTIALS_ID = 'dockerhub-cred'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DipanshuRawat/hello-world-node.git'
            }
        }

        stage('Unit Test') {
            steps {
                sh '''
                    if [ -f "pom.xml" ]; then
                      mvn test
                    elif [ -f "package.json" ]; then
                      npm install
                      npm test
                    elif [ -f "requirements.txt" ]; then
                      pip install -r requirements.txt
                      pytest
                    else
                      echo "No known project structure detected for unit tests."
                    fi
                '''
            }
        }

        stage('Build Docker Image and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        docker build -t $DOCKER_IMAGE .
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG

                        kubectl apply -f deployment.yaml
                        kubectl apply -f service.yaml

                        kubectl rollout status deployment/hello-world-deployment
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Build and Deployment Successful!'
        }
        failure {
            echo '❌ Build or Deployment Failed! Check logs.'
        }
        always {
            cleanWs()  // Clean workspace

            emailext (
                to: 'princerawat2108@gmail.com',
                subject: "Jenkins Job: ${env.JOB_NAME} [${env.BUILD_NUMBER}] - ${currentBuild.currentResult}",
                body: """\
                Build Result: ${currentBuild.currentResult}
                Job: ${env.JOB_NAME}
                Build Number: ${env.BUILD_NUMBER}
                Build URL: ${env.BUILD_URL}
                """,
                mimeType: 'text/plain'
            )
        }
    }
}
