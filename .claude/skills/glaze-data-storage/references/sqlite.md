# SQLite Decision Guide

Use SQLite only when JSON no longer fits the access pattern.

## Good reasons

- Relational data requiring joins or aggregations.
- Full-text search over a substantial corpus.
- Roughly 10,000 or more growing records.
- Multiple entity types with real relationships, such as projects, tasks, and comments.
- Querying or updating a subset without reading and rewriting the entire dataset.

## Keep JSON when

- Data is simple settings or configuration.
- The primary shape is a modest linear list such as notes, todos, or history.
- The app reads and writes the whole object naturally.
- There are no complex query, indexing, or transactional requirements.

Place the database under `app.getPath("userData")`. SQLite requires a native binding and the corresponding `copyNativeBindings` build configuration.

Use explicit schema versions and migrations. Do not silently recreate a database after an open or migration failure.
