FROM circleci/node:12.16.3-browsers
USER root
ENV DISPLAY :99.0
ENV SC_ENV=production-hyperspace
RUN  apt-get install -y xvfb libudev-dev

WORKDIR /statechannels/apps

# Copy the necessary packages
COPY .env.* ./
COPY *.json ./
COPY yarn.lock ./
COPY ./packages/persistent-seeder/ packages/persistent-seeder/

COPY ./packages/e2e-tests packages/e2e-tests/

# Add non-root, set permissions, switch user
RUN useradd --create-home --no-log-init --shell /bin/bash seeder
RUN chown -R seeder: /statechannels/apps
USER seeder

# Install dependencies
RUN yarn --network-timeout 100000

WORKDIR /statechannels/apps/packages/persistent-seeder

COPY ./packages/persistent-seeder/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]