.PHONY: help dev-frontend dev

help:
	@echo "Available commands:"
	@echo "  make dev-frontend    - Starts the frontend development server (Vite)"
       @echo "  make dev             - Starts the frontend development server"

dev-frontend:
        @echo "Starting frontend development server..."
        @cd frontend && npm run dev

dev:
       @echo "Starting frontend development server..."
       @make dev-frontend
