# Stage 1: production base
FROM node:14.2-alpine as base
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
# we use npm ci here so only the package-lock.json file is used
# npm ci looks at NODE_ENV and install only the necessary deps (devDeps only when in development)
RUN npm ci && npm cache clean --force

# Stage 2: development
FROM base as dev
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
RUN npm install --only=development
CMD ["node_modules/.bin/nodemon", "--config", "nodemon.json"]

# Stage 3: copy source in prod
# This gets our source code into builder
FROM dev as build
COPY . .
RUN npm run build

### PRODUCTION
FROM base as prod
COPY --from=build /app/dist .
CMD ["node", "index.js"]