# STAGE 1 - Typescript to Javascript
FROM node:20.11.1-slim as build-dependencies

ARG BUILD_VERSION

RUN apt-get update && apt-get install -y ca-certificates

# Create app directory
WORKDIR /app

# Install app dependencies with yarn 2
COPY .yarn/releases .yarn/releases
COPY .yarn/sdks .yarn/sdks
COPY .yarn/cache .yarn/cache
# COPY .yarn/plugins ./.yarn/plugins
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN yarn

# Bundle app source
COPY public public
COPY src src
COPY server server
COPY types types
COPY .env .
COPY .eslintignore .
COPY .eslintrc.js .
COPY .prettierrc.js .
COPY .svgrrc.js .
COPY .swcrc .
COPY nodemon.json .
COPY next-env.d.ts .
COPY next.config.js .
COPY tsconfig.json .
RUN mkdir dist

# Build sources
ENV DOCKER 1
ENV NODE_ENV production
RUN yarn build

# STAGE 2 - Docker server
FROM node:20.11.1-slim as prod

# Add ffmpeg for audio mix
RUN apt-get update && apt-get install -yq ffmpeg

# Create app directory
WORKDIR /app

# Install app dependencies with yarn 2
COPY .yarn/releases .yarn/releases
COPY .yarn/sdks .yarn/sdks
COPY .yarn/cache .yarn/cache
# COPY .yarn/plugins ./.yarn/plugins
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
RUN yarn

# Copy app files
COPY next.config.js .
COPY --from=build-dependencies app/dist dist
COPY --from=build-dependencies app/public public

ENV DOCKER 1
ENV NODE_ENV production

EXPOSE 5000

CMD [ "yarn", "start" ]
