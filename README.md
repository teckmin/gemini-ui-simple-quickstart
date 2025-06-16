# Fullstack Quickstart

This project demonstrates a simple fullstack application with a React frontend, a Node.js backend and an additional Semantic Kernel service. The frontend communicates with the Node backend which forwards requests to the Semantic Kernel service. The service processes the messages using OpenAI powered agents that coordinate product guides, troubleshooting and device status assistants.

## Features

- 💬 React frontend with Vite
- 🌐 Node.js 20 backend forwarding requests
- 🤖 Semantic Kernel service using .NET 8 and OpenAI

## Project Structure

- `frontend/` – React application
- `backend/` – Node.js forwarding API
- `sk-service/` – Semantic Kernel service implementing the AI agents

## Development

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- OpenAI API key

### Install Dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### Run Development Servers

Start the Semantic Kernel service and the Node backend:

```bash
# from project root
node backend/server.js &
# in another terminal start the Semantic Kernel service
# dotnet run --project sk-service
```

The frontend can be started with:

```bash
cd frontend && npm run dev
```

Open the frontend at `http://localhost:5173`.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
