import { Context as TelegrafContext } from 'telegraf';

export enum EnumTelegrafContextTypes {
  FOLDER_NAVIGATION = 'folderNavigating',
  FOLDER_DELETE = 'folderDelete',
}

export interface Context extends TelegrafContext {
  session: {
    type?: EnumTelegrafContextTypes;
  };
}
