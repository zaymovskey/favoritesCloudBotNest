import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'typegram/markup';
export function fileActionsKeyboard(): InlineKeyboardButton[][] {
  return [[Markup.button.callback('Удалить файл ❌', 'test')]];
}
