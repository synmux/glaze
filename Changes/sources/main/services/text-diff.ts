const MAX_LINES_TO_DIFF = 2000;
const CONTEXT_LINES = 2;
const MAX_OUTPUT_LINES = 300;

export type DiffLineType = "add" | "remove" | "context" | "skip";

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

/** Classic LCS-based line diff. Quadratic in line count, bounded by MAX_LINES_TO_DIFF. */
function lcsDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const n = oldLines.length;
  const m = newLines.length;
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = oldLines[i] === newLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ type: "context", text: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: oldLines[i] });
      i++;
    } else {
      ops.push({ type: "add", text: newLines[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ type: "remove", text: oldLines[i] });
    i++;
  }
  while (j < m) {
    ops.push({ type: "add", text: newLines[j] });
    j++;
  }
  return ops;
}

/** Collapses long unchanged runs into a skip marker, keeping a little context around each change. */
function condense(ops: DiffLine[]): DiffLine[] {
  const keep = new Array<boolean>(ops.length).fill(false);
  for (let idx = 0; idx < ops.length; idx++) {
    if (ops[idx].type === "context") continue;
    for (let k = Math.max(0, idx - CONTEXT_LINES); k <= Math.min(ops.length - 1, idx + CONTEXT_LINES); k++) {
      keep[k] = true;
    }
  }

  const result: DiffLine[] = [];
  let skipped = 0;
  for (let idx = 0; idx < ops.length; idx++) {
    if (!keep[idx]) {
      skipped++;
      continue;
    }
    if (skipped > 0) {
      result.push({ type: "skip", text: `${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
      skipped = 0;
    }
    result.push(ops[idx]);
  }
  if (skipped > 0) {
    result.push({ type: "skip", text: `${skipped} unchanged line${skipped === 1 ? "" : "s"}` });
  }
  return result;
}

/**
 * Line-based diff between two text snapshots, condensed to changed lines plus a little
 * surrounding context. Always returns an array — empty when the texts are identical,
 * or a single "skip" line explaining why no diff could be computed for oversized input.
 */
export function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  if (oldText === newText) return [];

  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  if (oldLines.length > MAX_LINES_TO_DIFF || newLines.length > MAX_LINES_TO_DIFF) {
    return [{ type: "skip", text: "Diff not shown — content is too large to compare line by line" }];
  }

  const condensed = condense(lcsDiff(oldLines, newLines));
  if (condensed.length <= MAX_OUTPUT_LINES) return condensed;

  const truncated = condensed.slice(0, MAX_OUTPUT_LINES);
  truncated.push({ type: "skip", text: "Diff truncated — too many changed lines to display" });
  return truncated;
}
