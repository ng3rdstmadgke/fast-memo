#!/bin/bash

mkdir -p ~/.ssh
mkdir -p ~/.aws
mkdir -p ~/.fast-memo/.kube
mkdir -p ~/.fast-memo/.config/helm
mkdir -p ~/.fast-memo/.claude

DOCKER_NETWORK=br-fast-memo-${USER}
NETWORK_EXISTS=$(docker network ls --filter name=$DOCKER_NETWORK --format '{{.Name}}')

if [ -z "$NETWORK_EXISTS" ]; then
  docker network create $DOCKER_NETWORK
fi