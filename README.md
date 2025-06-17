# Gemini UI Quickstart

This project provides a small React frontend that communicates with an external API. The API accepts a JSON payload of chat `messages` and returns a JSON object with a `response` field that is shown to the user.

![Gemini Fullstack](./app.png)

## Features

- ✨ Simple React interface.
- 🔄 Hot-reloading during development using Vite.

## Project Structure

The project contains a single directory:

-   `frontend/`: The React application built with Vite.

## Getting Started: Development and Local Testing

Follow these steps to get the application running locally for development and testing.

**1. Prerequisites:**

-   Node.js and npm (or yarn/pnpm)

**2. Install Dependencies:**

```bash
cd frontend
npm install
```

**3. Run the Development Server:**

```bash
make dev
```
Open your browser and navigate to `http://localhost:5173`.

## Deployment

The frontend can be built with Vite and served from any static web server:

```bash
cd frontend
npm run build
```

The optimized output will be in `frontend/dist/`.

## Technologies Used

- [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/)) - For the frontend user interface.
- [Tailwind CSS](https://tailwindcss.com/) - For styling.
- [Shadcn UI](https://ui.shadcn.com/) - For components.
- [Google Gemini](https://ai.google.dev/models/gemini) - LLM for query generation, reflection, and answer synthesis.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details. 