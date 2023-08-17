import { Context as TelegrafContext } from 'telegraf';

export interface Context extends TelegrafContext {
  session: {
    folderId: number | null;
    processedFolderId?: number | null;
  };
}
