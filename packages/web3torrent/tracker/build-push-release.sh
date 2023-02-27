#!/bin/sh
set -euf
BASEDIR=$(dirname "$0")

docker build -t registry.heroku.com/web3torrent-tracker-hyperspace/web -f "$BASEDIR"/Dockerfile "$BASEDIR"
docker push registry.heroku.com/web3torrent-tracker-hyperspace/web
heroku container:release -a web3torrent-tracker-hyperspace web

# In order to push this to heroku, one must run `heroku container:login` in order to avoid the "no basic auth credentials" error