export type TaskPositionUpdate = {
  id: string;
  position: number;
};

/**
 * Insert movedTaskId at targetIndex (0-based) after removing it from the list, then reindex 0..n-1.
 */
export function computeColumnPositions(
  orderedIds: string[],
  movedTaskId: string,
  targetIndex: number,
): TaskPositionUpdate[] {
  const withoutMoved = orderedIds.filter((id) => id !== movedTaskId);
  const clampedIndex = Math.max(0, Math.min(targetIndex, withoutMoved.length));
  const next = [...withoutMoved];
  next.splice(clampedIndex, 0, movedTaskId);
  return next.map((id, position) => ({ id, position }));
}

/** Reindex remaining tasks in a column after a task leaves (cross-column move). */
export function reindexAfterRemove(orderedIds: string[]): TaskPositionUpdate[] {
  return orderedIds.map((id, position) => ({ id, position }));
}
