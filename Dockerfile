FROM node:14-alpine

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --ignore-optional --frozen-lockfile

COPY . .

RUN yarn build

CMD ["yarn", "start", "serve"]
