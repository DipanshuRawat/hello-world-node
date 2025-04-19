# CI/CD Pipeline for Application using Jenkins, Docker, Kubernetes, and GitHub Webhooks

This project demonstrates a full CI/CD setup:
- Jenkins pipeline to build, test, and deploy a Node.js app
- Docker image build and push to DockerHub
- Deploy application on Minikube (local Kubernetes)
- Trigger pipeline automatically using GitHub webhook via ngrok

---

## 🚀 Jenkinsfile Explanation

The `Jenkinsfile` defines the following stages:

1. **Checkout**
   - Clone the GitHub repository.

2. **Unit Test**
   - Automatically detects project type:
     - If `pom.xml` ➔ runs `mvn test`
     - If `package.json` ➔ runs `npm install` and `npm test`
     - If `requirements.txt` ➔ runs `pip install` and `pytest`
   - If no recognizable structure, prints a message.

3. **Build Docker Image and Push**
   - Build a Docker image from the codebase.
   - Authenticate with DockerHub using credentials stored in Jenkins.
   - Push the image to your DockerHub repository.

4. **Deploy to Kubernetes**
   - Use kubeconfig credentials to authenticate.
   - Deploy Kubernetes manifests (`deployment.yaml`, `service.yaml`).
   - Wait until deployment rollout is successful.

5. **Post Actions**
   - If build succeeds or fails, clean workspace.
   - Send email notifications with build details.

---

## 🌎 Environment Variables (in Jenkins Pipeline)

Inside the `Jenkinsfile`, environment variables are defined like this:

```groovy
environment {
    DOCKER_IMAGE = 'yourdockerhubusername/yourappname:tag'
    KUBECONFIG_CREDENTIALS_ID = 'jenkins-credential-id-for-kubeconfig'
    DOCKER_CREDENTIALS_ID = 'jenkins-credential-id-for-dockerhub'
}
```
## Jenkins Credentials Setup

To use DockerHub and Kubernetes credentials in your Jenkins Pipeline:

Go to:  
**Manage Jenkins → Manage Credentials → (Global) → Add Credentials**

Create the following:

- **DOCKER_CREDENTIALS_ID**
  - Kind: Username with password
  - Username: Your DockerHub username
  - Password: Your DockerHub password
  - ID: `jenkins-credential-id-for-dockerhub`

- **KUBECONFIG_CREDENTIALS_ID**
  - Kind: Secret file
  - Upload your `kubeconfig` file (`~/.kube/config`)
  - ID: `jenkins-credential-id-for-kubeconfig`
 
# Final Output for Node.js Project.

![Screenshot (510)](https://github.com/user-attachments/assets/02f3b7cb-abe0-44ef-b938-c7280161eae2)

![Screenshot 2025-04-19 151126](https://github.com/user-attachments/assets/a3cdc22c-c430-4035-a625-3bcd15063be4)

# Webhook Setup - Why Localhost Doesn't Work

GitHub Webhooks cannot send requests to localhost because:

- localhost is private to your machine.
- GitHub servers cannot reach your local computer directly.

## Solution:

We need a public URL to receive webhook requests.
for that I uses **ngrok** Which uses reverse proxy for localhost

![Screenshot (511)](https://github.com/user-attachments/assets/a0ed6c6b-9d9d-475a-9e27-1735d803649c)

![Screenshot (512)](https://github.com/user-attachments/assets/50074015-d9d0-4bfc-99cd-05c14fce95d4)

# For Monitoring of Jenkins Jobs, I use Prometheus and Grafana

![Screenshot 2025-04-19 151246](https://github.com/user-attachments/assets/9fc80855-ef43-47bd-9557-fcf28fff5935)
