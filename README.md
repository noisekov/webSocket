# Chat SPA Application written on vanilla TypeScript

Made without using querySelector.
The project is a fully functional chat application.

## Technologies

-   **Client**: TypeScript
-   **Server**: Pre-built [server](https://github.com/noisekov/webSocket/tree/main/src/server) in JavaScript
-   **Additional**: WebSocket

## Installation & Setup

Clone the repository:

### 1. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd src/server
npm install
```

### 2. Client Setup

From the root directory, install dependencies and start the application:

```bash
Rename the .env.example file to .env
npm install
npm run start # Launches both the server and client
```

Note: This project uses two separate node_modules directories—one for the server and one for the client.
