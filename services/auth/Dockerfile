FROM node:20-alpine

WORKDIR /app

# copy shared ONCE
COPY shared ./shared

# copy service
COPY services/auth ./services/auth

WORKDIR /app/services/auth

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