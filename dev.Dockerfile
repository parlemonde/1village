FROM node:20.11.1-slim

# Needed for nodemon!
RUN apt-get update && apt-get install -y --no-install-recommends \
    lsof \
    procps \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install app dependencies with yarn 2
COPY .yarn/releases ./.yarn/releases
COPY .yarn/sdks ./.yarn/sdks
COPY .yarn/cache ./.yarn/cache
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY public ./public
COPY src ./src
COPY server ./server
COPY types ./types
COPY .env ./
COPY .eslintignore ./
COPY .eslintrc.js ./
COPY .prettierrc.js ./
COPY .svgrrc.js ./
COPY .swcrc ./
COPY nodemon.json ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./
RUN mkdir dist

ENV DOCKER 1

EXPOSE 5000

CMD [ "yarn", "dev" ]
