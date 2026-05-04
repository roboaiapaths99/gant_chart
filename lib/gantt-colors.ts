export const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#84CC16', // Lime
  '#64748B', // Slate
];

export function getColorForResource(resourceName: string): string {
  if (!resourceName) return COLOR_PALETTE[0];
  
  const hash = resourceName.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

export function getTaskColor(task: any, defaultColor?: string): string {
  if (defaultColor) return defaultColor;
  if (task.resourceNames) {
    return getColorForResource(task.resourceNames);
  }
  return COLOR_PALETTE[0];
}
