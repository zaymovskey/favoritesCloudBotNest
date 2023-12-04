import { Markup } from 'telegraf';

export function leaveSceneFooter(message = 'Отменить') {
  return [Markup.button.callback(message, 'cancel')];
}
