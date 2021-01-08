# STAGE 1 - Typescript to Javascript
FROM node:12.13-alpine as build-dependencies

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN yarn install

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
COPY nodemon.json ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./
RUN mkdir dist

# Build sources
ENV NODE_ENV production
ENV DOCKER 1
RUN yarn build

# STAGE 2 - Docker server
FROM node:12.13-alpine as prod

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN yarn install --production

# Copy app files
COPY next.config.js ./
COPY --from=build-dependencies app/dist dist
COPY --from=build-dependencies app/public public

ENV DOCKER 1
ENV NODE_ENV production

EXPOSE 5000

CMD [ "node", "./dist/server/app.js" ]
