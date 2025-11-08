#!/bin/bash

set -e

CONTAINER_NAME=${PROJECT_NAME}-sample-redis

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



# DockerHub: https://hub.docker.com/_/redis
docker rm -f $CONTAINER_NAME || true
docker run \
  --rm \
  -d \
  --network $DOCKER_NETWORK \
  --name $CONTAINER_NAME \
  -v ${HOST_DIR}/docker/redis/conf:/usr/local/etc/redis \
  redis:8.2 \
  redis-server /usr/local/etc/redis/redis.conf


docker logs -f $CONTAINER_NAME
