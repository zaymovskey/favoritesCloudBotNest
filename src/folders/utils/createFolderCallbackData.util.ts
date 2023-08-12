import { EnumFolderActions } from '../folders.service';

export function createFolderCallbackData(
  action: EnumFolderActions,
  folderId: number,
): string {
  return `${action};${folderId}`;
}
