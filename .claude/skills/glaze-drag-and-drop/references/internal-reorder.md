# Internal Reorder and Move

Use renderer-native drag-and-drop for moving items within the app:

```tsx
const onDragStart = (event: React.DragEvent, id: string) => {
  event.dataTransfer.setData("text/plain", id);
};

const onDrop = (event: React.DragEvent, targetId: string) => {
  event.preventDefault();
  const sourceId = event.dataTransfer.getData("text/plain");
  // Reorder state from sourceId to targetId.
};
```

Call `preventDefault()` in `onDragOver`, expose a visible drag affordance, and preserve keyboard-accessible reorder actions rather than making drag the only interaction.
