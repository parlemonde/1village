#!/bin/bash
cd 1village
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker pull $IMAGE
docker tag $IMAGE 1village
docker stop 1village && docker rm 1village
docker run -d --restart unless-stopped -p 8000:5000 --env-file=.env --name 1village 1village
docker image prune -f
