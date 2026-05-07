pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/kinjalpatel687/Repository-name-playwright-automation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }

        stage('Generate Report') {
            steps {
                bat 'npx playwright show-report'
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }

        success {
            echo 'Playwright Tests Passed ✅'
        }

        failure {
            echo 'Playwright Tests Failed ❌'
        }
    }
}