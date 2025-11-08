#!/bin/bash

set -e

CONTAINER_NAME=${PROJECT_NAME}-sample-rabbitmq

function usage() {
cat >&2 <<EOF
ログ:
docker logs -f $CONTAINER_NAME


ログインコマンド:


EOF
exit 1
}

args=()
while [ "$1" != "" ]; do
  case $1 in
    -h | --help ) usage ;;
    *           ) args+=("$1") ;;
  esac
  shift
done



# DockerHub: https://hub.docker.com/_/redis
docker rm -f $CONTAINER_NAME || true
docker run \
  --rm \
  -d \
  --network $DOCKER_NETWORK \
  --name $CONTAINER_NAME \
   -e RABBITMQ_DEFAULT_USER=app \
   -e RABBITMQ_DEFAULT_PASS=pass1234 \
  rabbitmq:4.1-management

docker logs -f $CONTAINER_NAME
