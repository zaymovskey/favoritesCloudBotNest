import { Markup } from 'telegraf';

export function cancelFooterKeyboard() {
  return [Markup.button.callback('Отменить', 'cancel')];
}
