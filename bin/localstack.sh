#!/bin/bash

set -e

CONTAINER_NAME="${PROJECT_NAME}-sample-localstack"

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

# DockerHub: https://hub.docker.com/r/localstack/localstack
# NOTE: lambdaサービスを利用するには、Dockerソケットをマウントする必要がある
docker rm -f $CONTAINER_NAME || true
docker run \
  --rm \
  -d \
  --network $DOCKER_NETWORK \
  --name $CONTAINER_NAME \
  -v "$HOST_DIR/docker/localstack/conf:/etc/localstack/init/ready.d" \
  -v "/var/run/docker.sock:/var/run/docker.sock" \
  localstack/localstack:latest

docker logs -f $CONTAINER_NAME
