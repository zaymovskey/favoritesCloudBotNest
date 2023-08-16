import { Markup } from 'telegraf';
import { createFolderCallbackData } from '../utils/createFolderCallbackData';
import { EnumFolderActions } from '../folders.interfaces';
import { InlineKeyboardButton } from 'typegram/markup';

export function folderFooterKeyboard(
  parentId: number | null,
  folderId: number | null,
): InlineKeyboardButton[][] {
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
        createFolderCallbackData(EnumFolderActions.RENAME, folderId),
      ),
      Markup.button.callback(
        'Удалить папку ❌',
        createFolderCallbackData(EnumFolderActions.REMOVE, folderId),
      ),
    ],
  ];
}
