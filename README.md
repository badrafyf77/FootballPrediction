# FootballPrediction DevOps Monorepo

This repository is organized for a full DevOps workflow with Docker, Kubernetes, Terraform, Ansible, and CI/CD.

## Structure

- `app/backend`: FastAPI backend service
- `app/frontend`: React frontend service
- `kubernetes`: Kubernetes manifests for local and cluster deployment
- `terraform`: Infrastructure as code (AWS resources)
- `ansible`: Configuration management and provisioning playbooks
- `.github/workflows`: CI/CD workflows
- `docs`: Architecture notes, runbooks, and team documentation

## Local Docker Run

```bash
docker compose build
docker compose up -d
curl http://127.0.0.1:7860/health
curl -I http://127.0.0.1:8080/
```

## Local Kubernetes Run (Minikube)

```bash
minikube start --driver=docker
minikube image load footballprediction-backend:latest
minikube image load footballprediction-frontend:latest
kubectl apply -f kubernetes/
kubectl get deployments,pods,svc
```

## Team Workflow

- Create feature branch
- Open PR to `main`
- Merge only after checks pass
- Use immutable Docker tags (commit SHA) in CI/CD
