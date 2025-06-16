# Stage 1: build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend-node/package.json ./
COPY backend-node/package-lock.json ./
RUN npm install
COPY backend-node/ ./
RUN npm run build

# Final stage
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY backend-node/package.json ./backend/package.json
RUN npm install --omit=dev --prefix ./backend
EXPOSE 8000
CMD ["node", "backend/dist/index.js"]
