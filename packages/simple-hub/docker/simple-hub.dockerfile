FROM counterfactual/statechannels:0.5.13
FROM  --platform=linux/amd64 node:12.16.3 
ENV SC_ENV=production-hyperspace
ENV NODE_ENV=production
WORKDIR /statechannels/apps

# TODO: This can be narrowed down to just the simple-hub package and it's dependencies
COPY . /statechannels/apps/



# Install production dependencies for simple-hub
RUN yarn global add typescript ts-node
RUN yarn




WORKDIR /statechannels/apps/packages/simple-hub
RUN yarn build

# docker-entrypoint.sh starts a shell that execs the list of arguments in CMD
# This works around the following heroku constraint:
# https://devcenter.heroku.com/articles/container-registry-and-runtime#dockerfile-commands-and-runtime
#   CMD will always be executed by a shell ... to execute single binaries or use images without a shell please use ENTRYPOINT
# To interactively debug the container:
# docker run -it registry.heroku.com/simple-hub-production/simple-hub:latest bash
ENTRYPOINT ["docker/docker-entrypoint.sh"]
CMD ["node", "./lib/src/server.js"]
