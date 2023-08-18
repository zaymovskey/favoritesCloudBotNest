import { Context as TelegrafContext } from 'telegraf';

export interface Context extends TelegrafContext {
  session: {
    folderId: number | null;
    processedFolderId?: number | null;
  };
}

type NonEmptyArray<T> = [T, ...T[]];

interface PhotoContextArrayItem {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface PhotoContext extends Omit<TelegrafContext, 'update'> {
  update: { message: { photo: NonEmptyArray<PhotoContextArrayItem> } };
}
