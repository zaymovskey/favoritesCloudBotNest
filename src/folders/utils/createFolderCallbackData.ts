import { EnumFolderActions } from '../folders.interfaces';

export function createFolderCallbackData(
  action: EnumFolderActions,
  folderId: number | null,
  parentId: number | null = null,
): string {
  return `${action};${folderId};${parentId}`;
}
