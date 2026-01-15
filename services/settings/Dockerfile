FROM node:20-alpine

WORKDIR /app

# 1️⃣ Root workspace context (CRITICAL)
COPY package.json package-lock.json ./

# 2️⃣ Copy shared workspace
COPY shared ./shared

# 3️⃣ Install shared deps + build shared
WORKDIR /app/shared
RUN npm install
RUN npm run build

# 4️⃣ Copy service
WORKDIR /app
COPY services/settings ./services/settings

# 5️⃣ Install service deps + build
WORKDIR /app/services/settings
RUN npm install
RUN npm run build

CMD ["node", "dist/index.js"]



# FROM node:20-alpine

# WORKDIR /app

# # copy shared ONCE
# COPY shared ./shared

# # copy service
# COPY services/settings ./services/settings

# WORKDIR /app/services/settings

# RUN npm install
# RUN npm run build

# CMD ["node", "dist/index.js"]

# ******************************************

# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# COPY tsconfig.json .
# RUN npm install

# COPY . .

# CMD [ "npm", "start" ]