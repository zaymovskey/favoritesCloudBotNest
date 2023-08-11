import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';

@Injectable()
export class FoldersService {
  readonly foldersKBColumns = 3;
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  public async getUserFoldersKB(
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

  createUserFoldersKB(folders: Folder[]) {
    const markupButtons = folders.map((folder) =>
      Markup.button.callback(
        folder.name,
        JSON.stringify({
          action: 'toFolder',
          folderId: folder.id,
        }),
      ),
    );

    return Markup.inlineKeyboard(markupButtons, {
      columns: this.foldersKBColumns,
    });
  }
}
