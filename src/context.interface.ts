import { Context as TelegrafContext } from 'telegraf';
import { EnumFileTypes } from './files/files.model';
import { Audio, Document, Video } from 'typegram';

export interface MessageToDelete {
  id: number;
  is_duplicate?: boolean;
}

export interface Context extends TelegrafContext {
  session: {
    folderId: number | null;
    processedFolderId?: number | null;
    messagesToDelete: MessageToDelete[];
    mainMessageId: number;
  };
}

type NonEmptyArray<T> = [T, ...T[]];

interface FilesContextArrayItem {
  file_id: string;
}

export interface FilesContext extends Omit<TelegrafContext, 'update'> {
  update: {
    message: {
      photo: NonEmptyArray<FilesContextArrayItem>;
      video: Video;
      audio: Audio;
      document: Document;
    };
  };
}
