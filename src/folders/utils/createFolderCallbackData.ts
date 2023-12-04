export function createFolderCallbackData(
  action: string,
  folderId: number | null,
  parentId: number | null = null,
): string {
  return `${action};${folderId};${parentId}`;
}
