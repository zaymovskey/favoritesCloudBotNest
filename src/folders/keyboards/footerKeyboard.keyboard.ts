import { Markup } from 'telegraf';
import { createFolderCallbackData } from '../utils/createFolderCallbackData';
import { EnumFolderActions } from '../folders.interfaces';

export function footerKeyboardKeyboard(
  parentId: number | null,
  folderId: number | null,
) {
  return [
    Markup.button.callback(
      'Создать папку ➕',
      createFolderCallbackData(EnumFolderActions.ADD, folderId),
    ),
    Markup.button.callback(
      'Назад ⬅️',
      createFolderCallbackData(EnumFolderActions.NAV, parentId),
    ),
  ];
}
