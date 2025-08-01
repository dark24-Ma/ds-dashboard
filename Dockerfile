FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .
RUN npm run dev

FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --only=production
# COPY .env .


# COPY --from=builder /app/dist ./dist

EXPOSE 8087
CMD ["node", "dist/main"]
