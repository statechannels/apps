#!/bin/sh
set -euf -o pipefail
BASEDIR=$(dirname "$0")

docker build -t registry.heroku.com/simple-hub-hyperspace/simple-hub -f "$BASEDIR"/simple-hub.dockerfile "$BASEDIR"/../../..
docker push registry.heroku.com/simple-hub-hyperspace/simple-hub
heroku container:release -a simple-hub-hyperspace simple-hub
