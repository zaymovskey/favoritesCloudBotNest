import { Markup } from 'telegraf';
import { createFolderCallbackData } from '../utils/createFolderCallbackData.util';
import { EnumFolderActions } from '../folders.interfaces';

export function footerKeyboard(parentId: number | null) {
  return [
    Markup.button.callback(
      'Назад ⬅️',
      createFolderCallbackData(EnumFolderActions.NAV, parentId),
    ),
  ];
}
