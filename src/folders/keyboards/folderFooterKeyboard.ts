import { Markup } from 'telegraf';
import { createFolderCallbackData } from '../utils/createFolderCallbackData';
import { EnumFolderActions } from '../folders.interfaces';
import { InlineKeyboardButton } from 'typegram/markup';
import { EnumFilesActions } from '../../files/files.interfaces';

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
    [Markup.button.callback('Добавить файлы 🗎', 'add_files')],
  ];
}
