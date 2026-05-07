pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

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