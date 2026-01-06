FROM node:20-alpine
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy prisma files
COPY prisma ./prisma
COPY prisma.config.ts ./

# Pass DATABASE_URL to Prisma during build
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}


# Generate Prisma client
RUN npx prisma generate --schema ./prisma/schema.prisma

# Copy rest of the source code
COPY . .

# Build NestJS
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
# CMD ["node", "dist/main.js"]
