FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --ignore-optional --frozen-lockfile
COPY . .
RUN yarn build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install --ignore-optional --frozen-lockfile --production=true
CMD ["yarn", "start", "serve"]
