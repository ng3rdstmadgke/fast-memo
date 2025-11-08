#!/bin/bash

set -e


CONTAINER_NAME="${PROJECT_NAME}-sample-postgresql"

function usage() {
cat >&2 <<EOF
Usage: $0 [options]

[options]
  -h, --help        Show this help message and exit
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


# DockerHub: https://hub.docker.com/_/postgres
docker rm -f $CONTAINER_NAME || true
docker run \
  --rm \
  -d \
  --network $DOCKER_NETWORK \
  --name $CONTAINER_NAME \
  -e POSTGRES_PASSWORD=root1234 \
  -e POSTGRES_USER=app \
  -e POSTGRES_DB=sample \
  postgres:16.10

docker logs -f $CONTAINER_NAME