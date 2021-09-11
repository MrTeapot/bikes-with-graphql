#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'

cleanup () {
  docker-compose -f docker-compose.tests.yaml -p tests kill > /dev/null
  docker-compose -f docker-compose.tests.yaml -p tests rm -f > /dev/null
}

trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"'\
HUP INT QUIT PIPE TERM

docker-compose -f docker-compose.tests.yaml -p tests up -d postgres > /dev/null
docker-compose -f docker-compose.tests.yaml -p tests build server > /dev/null
docker-compose -f docker-compose.tests.yaml -p tests run server npm run migrate up > /dev/null
docker-compose -f docker-compose.tests.yaml -p tests build server > /dev/null

docker-compose -f docker-compose.tests.yaml -p tests run server npm run test

cleanup