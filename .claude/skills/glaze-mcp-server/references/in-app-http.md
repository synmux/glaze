# In-App HTTP MCP Server

Use this shape only when tools must reach live in-memory state or drive the running app. Tell the user that the tools work only while the app remains open.

- [Server implementation](#server-implementation)
- [Security and lifecycle](#security-and-lifecycle)
- [Install and verify](#install-and-verify)

## Server implementation

Install `@modelcontextprotocol/sdk` and `zod@^3`, then start a Streamable HTTP endpoint from the backend.

```typescript
// main/services/mcp-http-server.ts
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { logger } from "@glaze/core/backend";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

export function stableMcpPort(projectId: string): number {
  let hash = 0;
  for (const char of projectId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 49152 + (hash % 16000);
}

function buildMcpServer(): McpServer {
  const server = new McpServer({ name: "notes", version: "1.0.0" });
  // Register task-shaped tools that call the app's existing services.
  return server;
}

export function startMcpHttpServer(projectId: string): void {
  const transports = new Map<string, StreamableHTTPServerTransport>();

  const httpServer = createServer(async (request, response) => {
    try {
      const { pathname } = new URL(request.url ?? "", "http://127.0.0.1");
      if (pathname !== "/mcp") {
        response.writeHead(404).end();
        return;
      }

      const sessionHeader = request.headers["mcp-session-id"];
      const sessionId = Array.isArray(sessionHeader) ? sessionHeader[0] : sessionHeader;
      let transport = sessionId ? transports.get(sessionId) : undefined;

      if (request.method === "POST") {
        let body = "";
        for await (const chunk of request) body += chunk;
        const parsedBody: unknown = JSON.parse(body);

        if (!transport && isInitializeRequest(parsedBody)) {
          const newTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (newSessionId) => transports.set(newSessionId, newTransport),
          });
          newTransport.onclose = () => {
            if (newTransport.sessionId) transports.delete(newTransport.sessionId);
          };
          await buildMcpServer().connect(newTransport);
          transport = newTransport;
        }
        if (!transport) {
          response.writeHead(400).end("Unknown or missing MCP session");
          return;
        }
        await transport.handleRequest(request, response, parsedBody);
        return;
      }

      if (request.method === "GET" || request.method === "DELETE") {
        if (!transport) {
          response.writeHead(400).end("Unknown or missing MCP session");
          return;
        }
        await transport.handleRequest(request, response);
        return;
      }

      response.writeHead(405, { Allow: "GET, POST, DELETE" }).end();
    } catch (error) {
      logger.error("mcp", "MCP request failed", { error: String(error) });
      if (!response.headersSent) response.writeHead(500).end();
    }
  });

  httpServer.once("error", (error) => {
    logger.warn("mcp", "MCP HTTP server failed to start", { error: String(error) });
  });
  httpServer.listen(stableMcpPort(projectId), "127.0.0.1");
}
```

Call `startMcpHttpServer(projectId)` after backend startup, using the project ID from `package.json`.

## Security and lifecycle

- Bind only to `127.0.0.1`; the endpoint has no authentication.
- Create one transport per MCP session and remove it on close.
- Parse the URL pathname before routing because `request.url` can contain a query.
- Treat port collisions as a degraded optional feature: log the failure and keep the app running.
- Register tools against existing services instead of duplicating live state.

## Install and verify

Compute the real deterministic port and print commands without placeholders:

```bash
claude mcp add --scope user --transport http notes http://127.0.0.1:54321/mcp
codex mcp add notes -- npx -y mcp-remote http://127.0.0.1:54321/mcp
```

Build and launch the app, then send an initialize POST with `curl` and call one real tool before handing over.
