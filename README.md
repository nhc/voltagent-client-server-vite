# VoltAgent browser based client-server application

A full-stack implementation of VoltAgent featuring a Hono server backend and a Vite React TypeScript chat interface frontend.

> **⚠️ Development Environment Only**  
> The server implementation in `server/src/index.ts` is currently configured for development purposes only. This boilerplate provides a quick starting point for development but is not intended for production use. Consider implementing proper production configurations, security measures, and error handling before deploying to production.

## Overview

This project demonstrates a practical implementation of VoltAgent, an open-source TypeScript framework for building AI agent applications. The application consists of two main components:

- **Backend**: A Hono server implementing VoltAgent's `agent.streamText` functionaility.
- **Frontend**: A modern React TypeScript application with a chat interface

## Project Structure

```
.
├── client/          # Frontend React TypeScript application
│   ├── src/        # Source code
│   │   ├── components/    # React components
│   │   └── App.tsx       # Main application component
│   └── package.json
├── server/         # Backend VoltAgent implementation
│   ├── src/       # Source code
│   │   ├── voltagent/      # VoltAgent AI agents implementation
│   │   │   └── index.ts # Main agent configuration and setup
│   │   └── index.ts     # Server entry point
│   └── package.json
└── README.md
```

> **Note**: The `agents` folder contains the VoltAgent AI agent implementations. For more information about VoltAgent and its capabilities, refer to the [official documentation](https://voltagent.dev/docs/agents/overview/).

## Getting Started

### 1. Clone the Repository

```bash
git clone [repository-url]
cd voltagent-client-server-vite
```

### 2. Install Dependencies

Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the server directory with the following variables:

```env
OPENAI_API_KEY=your_api_key_here
```

### 4. Running the Application

#### Start the Backend Server

```bash
cd server
pnpm dev
```

The server will start on `http://localhost:3000` by default.

#### Start the Frontend Development Server

```bash
cd client
pnpm dev
```

The client will start on `http://localhost:5173` by default.

## Development

### Backend (Server)

The server is built with:

- Hono for the web server
- VoltAgent core for AI agent functionality
- TypeScript for type safety
- Zod for schema validation

Key scripts:

- `pnpm dev`: Start development server

### Frontend (Client)

The client is built with:

- React 19
- TypeScript
- Vite
- TailwindCSS

Key scripts:

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build

## VoltAgent Console

The project includes the VoltAgent Developer Console for debugging and monitoring your AI agents.

**The Console should start when you start the main server**

If you need to start it manually:

1. Start the VoltAgent server:

```bash
cd server
pnpm dev:voltagent
```

2. Access the console at [https://console.voltagent.dev](https://console.voltagent.dev)

The console provides:

- Real-time visualization of agent execution flow
- Function calls and tool usage monitoring
- Message history and debugging tools
- Direct connection to your local agent process (port 3141)
- No data is sent to external servers - everything stays local

## Features

- Real-time chat interface
- AI agent integration
- Type-safe development
- Modern UI with TailwindCSS
- Fast development with Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [VoltAgent](https://github.com/voltagent/voltagent) for the AI agent framework
- [Hono](https://hono.dev/) for the web server
- [Vite](https://vitejs.dev/) for the frontend build tool
