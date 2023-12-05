import { Markup } from 'telegraf';
import { EnumFilesActions } from '../files.interfaces';

export function leaveGetFolderFilesSceneKeyboard() {
  return [Markup.button.callback('Скрыть', EnumFilesActions.LEAVE_GET)];
}
