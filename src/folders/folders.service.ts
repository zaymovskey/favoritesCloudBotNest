import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';
import { createFolderCallbackData } from './utils/createFolderCallbackData.util';

export enum EnumFolderActions {
  NAVAHEAD = 'navAhead',
  NAVBACK = 'navBack',
}

@Injectable()
export class FoldersService {
  readonly foldersKBColumns = 3;
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  public async getFolders(
    userId: number,
    parentId: number | null = null,
  ): Promise<Folder[]> {
    return await this.folderRepo.findAll({
      where: {
        userId: userId,
        parentId: parentId,
      },
      order: ['name'],
    });
  }

  createFoldersKB(folders: Folder[]) {
    const markupButtons = folders.map((folder) =>
      Markup.button.callback(
        folder.name,
        createFolderCallbackData(EnumFolderActions.NAVAHEAD, folder.id),
      ),
    );

    return Markup.inlineKeyboard(markupButtons, {
      columns: this.foldersKBColumns,
    });
  }
}
