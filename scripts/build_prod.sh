 #!/bin/bash 

VERSION=$(git log -1 --pretty=%h) && \
REGISTRY="myregistry.com/bikes-server:" && \
TAG="$REGISTRY$VERSION" && \
LATEST="${REGISTRY}latest" && \
docker build -t "$TAG" -t "$LATEST" --target prod .