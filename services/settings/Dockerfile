FROM node:20-alpine

WORKDIR /app

# copy shared ONCE
COPY shared ./shared

# copy service
COPY services/settings ./services/settings

WORKDIR /app/services/settings

RUN npm install
RUN npm run build

CMD ["node", "dist/index.js"]

# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# COPY tsconfig.json .
# RUN npm install

# COPY . .

# CMD [ "npm", "start" ]