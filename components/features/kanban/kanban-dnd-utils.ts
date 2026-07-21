export type KanbanColumnLike = {
  id: string;
  tasks: { id: string }[];
};

/**
 * Resolve drop target from dnd-kit active/over ids.
 * Column ids and task ids share cuid namespace — columns matched first.
 */
export function resolveDropTarget(
  activeId: string,
  overId: string | undefined,
  columns: KanbanColumnLike[],
): { columnId: string; position: number } | null {
  if (!overId || activeId === overId) {
    return null;
  }

  const columnById = columns.find((column) => column.id === overId);
  if (columnById) {
    return {
      columnId: columnById.id,
      position: columnById.tasks.length === 0 ? 0 : columnById.tasks.length,
    };
  }

  for (const column of columns) {
    const overIndex = column.tasks.findIndex((task) => task.id === overId);
    if (overIndex === -1) {
      continue;
    }

    return { columnId: column.id, position: overIndex };
  }

  return null;
}

/**
 * Returns true when the move would leave task at the same column index.
 */
export function isNoOpMove(
  columns: KanbanColumnLike[],
  activeId: string,
  target: { columnId: string; position: number },
): boolean {
  for (const column of columns) {
    const activeIndex = column.tasks.findIndex((task) => task.id === activeId);
    if (activeIndex === -1) {
      continue;
    }

    return column.id === target.columnId && activeIndex === target.position;
  }

  return false;
}
