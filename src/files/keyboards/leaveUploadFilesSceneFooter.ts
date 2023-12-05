import { Markup } from 'telegraf';
import { EnumFilesActions } from '../files.interfaces';

export function leaveUploadFilesSceneFooter() {
  return [
    Markup.button.callback('Нет, это все', EnumFilesActions.LEAVE_UPLOAD),
  ];
}
