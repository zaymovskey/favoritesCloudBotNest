import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'typegram/markup';
import { createFilesCallbackData } from '../utils/createFilesCallbackData';
import { EnumFilesActions } from '../files.interfaces';
export function fileActionsKeyboard(fileId: number): InlineKeyboardButton[][] {
  return [
    [
      Markup.button.callback(
        'Удалить файл ❌',
        createFilesCallbackData(EnumFilesActions.REMOVE, fileId),
      ),
    ],
  ];
}
