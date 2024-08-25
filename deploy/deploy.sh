#!/bin/bash

kubectl delete  deployment vendure-deployment

sleep 5
# Run the minikube docker environment setup
eval $(minikube docker-env)

# Remove the old Docker image
docker rmi vendure:latest

# Build the new Docker image
docker build -t vendure:latest ../

kubectl apply -f vendure-service.yaml
kubectl apply -f configmap.yaml 

# Apply the Kubernetes deployment
kubectl apply -f vendure-deployment.yaml

echo "Deployment completed successfully."
