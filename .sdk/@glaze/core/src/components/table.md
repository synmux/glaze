# Table

A native macOS-style table for displaying structured data in rows and columns. Built from semantic HTML parts (`table`/`thead`/`tbody`/`tfoot`/`tr`/`th`/`td`) with alternating row backgrounds, rounded row corners, and a horizontally scrollable container. Reach for it when data has multiple columns that read best aligned in a grid.

## When to Use

- Multi-column structured data: metrics, reports, comparisons, settings tables.
- Use **List** for simple single-column item lists.
- Use CSS Grid/Flexbox for page layout — never a table.

## Usage Patterns

### Basic

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Age</TableHead>
      <TableHead>City</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
      <TableCell>25</TableCell>
      <TableCell>New York</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Footer and caption

`TableFooter` styles its rows distinctly for totals/summaries. `TableCaption` renders below the table (caption-bottom). Right-align numeric columns with `className="text-right"` and pin widths with `className="w-32"`.

```tsx
<Table>
  <TableCaption>Monthly usage statistics</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Project</TableHead>
      <TableHead className="text-right">Cost</TableHead>
      <TableHead className="text-right">Queries</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {projects.map((project) => (
      <TableRow key={project.id}>
        <TableCell>{project.name}</TableCell>
        <TableCell className="text-right">{formatCost(project.cost)}</TableCell>
        <TableCell className="text-right">{project.queries}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell className="text-right">{formatCost(totalCost)}</TableCell>
      <TableCell className="text-right">{totalQueries}</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Sticky header

Pass `sticky` to `TableHeader` when the table scrolls inside a taller container. This makes the header stick (`top-2`) and tells `Table` to skip its built-in `ScrollArea` so the parent handles scrolling.

```tsx
<div className="h-96 overflow-y-auto">
  <Table>
    <TableHeader sticky>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{/* many rows */}</TableBody>
  </Table>
</div>
```

### Rows with actions and empty state

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="w-16" />
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.length === 0 ? (
      <TableRow>
        <TableCell colSpan={3} className="text-center py-8">
          No data available
        </TableCell>
      </TableRow>
    ) : (
      items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            <Badge color={item.status === "active" ? "green" : "secondary"}>{item.status}</Badge>
          </TableCell>
          <TableCell>
            <Button iconOnly size="small" onClick={() => handleDelete(item)}>
              <TrashIcon className="w-3 h-3" />
            </Button>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

## Required Structure

```tsx
<Table>
  <TableCaption>{/* optional */}</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>{/* column header */}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>{/* cell */}</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>{/* optional */}</TableFooter>
</Table>
```

## Component API

All parts spread the native props for their underlying element and accept `className`. Only the non-standard props are listed.

### Table

Renders `<table>`. Wraps the table in a horizontal `ScrollArea` unless a child `TableHeader` has `sticky`, in which case the parent must provide scrolling.

| Prop           | Type      | Default | Description                                                    |
| -------------- | --------- | ------- | -------------------------------------------------------------- |
| `stickyHeader` | `boolean` | -       | Accepted on the type; sticky is driven by `TableHeader sticky` |

### TableHeader

Renders `<thead>`.

| Prop     | Type      | Default | Description                                                                     |
| -------- | --------- | ------- | ------------------------------------------------------------------------------- |
| `sticky` | `boolean` | -       | Pins the header (`sticky top-2`) and disables `Table`'s built-in scroll wrapper |

### TableBody

Renders `<tbody>`. Odd rows get a `bg-well` background; first/last cells in each row are corner-rounded. Props: native `<tbody>` + `className`.

### TableFooter

Renders `<tfoot>`. Footer cells get a distinct `bg-foreground-5` background and rounded corners. Props: native `<tfoot>` + `className`.

### TableRow

Renders `<tr>`. Props: native `<tr>` + `className`.

### TableHead

Renders `<th>`. Styled with secondary color, strong weight, left-aligned, `whitespace-nowrap`. Props: native `<th>` + `className`.

### TableCell

Renders `<td>`. Padded, middle-aligned, `whitespace-nowrap`. Props: native `<td>` + `className`.

### TableCaption

Renders `<caption>`, positioned below the table. Props: native `<caption>` + `className`.

## Design System Rules

### ✅ Do

- Use `TableHeader` / `TableBody` / `TableFooter` for headers, data, and totals respectively.
- Right-align numeric columns (`text-right`) for easier comparison.
- Pin column widths (`w-32`) for stable layouts.
- Provide a unique `key` on each mapped `TableRow`.
- Pass `sticky` to `TableHeader` and supply your own scroll container when the table is tall.

### ❌ Don't

- Use a table for simple single-column lists (use List) or for page layout.
- Mix different row/column structures within one table.
- Omit `TableHeader` — headers are required for accessibility.
