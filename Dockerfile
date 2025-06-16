# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend /app/frontend/dist ./frontend/dist
COPY backend/ ./backend
WORKDIR /app/backend
ENV PORT=2024
CMD ["node", "server.js"]
