#!/bin/bash

cd $PROJECT_DIR

docker build --rm \
  -f docker/app/Dockerfile \
  -t fast-memo/app/${HOST_USER}:latest \
  .

docker run --rm -ti \
  --name sample-app-${HOST_USER} \
  --network $DOCKER_NETWORK \
  fast-memo/app/${HOST_USER}:latest
