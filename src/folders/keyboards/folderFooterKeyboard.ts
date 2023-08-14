import { Markup } from 'telegraf';
import { createFolderCallbackData } from '../utils/createFolderCallbackData';
import { EnumFolderActions } from '../folders.interfaces';

export function folderFooterKeyboard(
  parentId: number | null,
  folderId: number | null,
) {
  return [
    [
      Markup.button.callback(
        'Создать папку ➕',
        createFolderCallbackData(EnumFolderActions.ADD, folderId),
      ),
      Markup.button.callback(
        'Назад ⬅️',
        createFolderCallbackData(EnumFolderActions.NAV, parentId, folderId),
      ),
    ],
    [
      Markup.button.callback(
        'Переименовать ✏️',
        // createFolderCallbackData(EnumFolderActions.REMOVE, folderId),
        'dump',
      ),
      Markup.button.callback(
        'Удалить папку ❌',
        createFolderCallbackData(EnumFolderActions.REMOVE, folderId),
      ),
    ],
  ];
}
