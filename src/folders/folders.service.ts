import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';
import { createFolderCallbackData } from './utils/createFolderCallbackData.util';
import { EnumFolderActions } from './folders.interfaces';

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

  async getDirectoryFoldersAndPath(
    userId: number,
    parentId: number | null = null,
  ) {
    const allUserFolders = await this.folderRepo.findAll({
      where: {
        userId: userId,
      },
    });

    const foldersKB = this.createFoldersKB(
      allUserFolders.filter((folder) => folder.parentId === parentId),
    );
    const path = this.createFolderPath(allUserFolders, parentId, parentId);

    return [foldersKB, path] as const;
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

  createFolderPath(
    userFolders: Folder[],
    folderId: number | null,
    targetFolderId: number | null,
  ): string {
    let path = '/';
    userFolders.forEach((folder) => {
      if (folder.id === folderId) {
        path = path + folder.name;
        path =
          path +
          this.createFolderPath(userFolders, folder.parentId, targetFolderId);
      }
    });

    if (folderId === targetFolderId) {
      path = path.split('/').reverse().join('/');
      if (path !== '/') path = path.slice(0, -1);
    }
    return path;
  }
}
