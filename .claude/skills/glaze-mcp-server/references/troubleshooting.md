# MCP Server Troubleshooting

- **`--print-data-dir` cannot find data:** Launch the app once so it creates its data directory.
- **Client fails to connect:** Re-run the smoke test, inspect the stored client config, verify the quoted script path, and confirm the configured Node executable exists.
- **Tool list is stale:** Start a new client session; do not reinstall the server.
- **Writes do not appear in the running app:** The app may cache persisted files. Restart it or add backend file watching and reload.
- **Stdio protocol contains invalid lines:** Route every diagnostic and dependency banner to stderr; stdout must contain JSON-RPC only.
- **HTTP server fails only for one app:** Check the deterministic port for collision and confirm the endpoint binds exclusively to `127.0.0.1`.
