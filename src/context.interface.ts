import { Context as TelegrafContext } from 'telegraf';
import { EnumFileTypes } from './files/files.model';

export interface Context extends TelegrafContext {
  session: {
    folderId: number | null;
    processedFolderId?: number | null;
  };
}

type NonEmptyArray<T> = [T, ...T[]];

interface FilesContextArrayItem {
  file_id: string;
}

export interface FilesContext<QueryKey extends EnumFileTypes>
  extends Omit<TelegrafContext, 'update'> {
  update: {
    message: { [key in QueryKey]: NonEmptyArray<FilesContextArrayItem> };
  };
}
