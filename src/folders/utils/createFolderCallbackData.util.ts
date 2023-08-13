import { EnumFolderActions } from '../folders.interfaces';

export function createFolderCallbackData(
  action: EnumFolderActions,
  folderId: number,
): string {
  return `${action};${folderId}`;
}
