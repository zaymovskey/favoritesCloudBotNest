import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';
import { createFolderCallbackData } from './utils/createFolderCallbackData.util';
import { EnumFolderActions } from './folders.interfaces';
import { footerKeyboard } from './keyboards/footer.keyboard';

@Injectable()
export class FoldersService {
  readonly foldersKBColumns = 3;
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  async getDirectoryFoldersAndPath(
    userId: number,
    folderId: number | null = null,
    parentId: number | null = null,
  ) {
    const allUserFolders = await this.folderRepo.findAll({
      where: {
        userId: userId,
      },
    });

    const foldersKB = this.createFoldersKB(
      allUserFolders.filter((folder) => folder.parentId === folderId),
      parentId,
    );
    const path = this.createFolderPath(allUserFolders, folderId, folderId);

    return [foldersKB, path] as const;
  }

  createFoldersKB(
    folders: Folder[],
    parentId: number | null,
    footer: boolean = true,
  ) {
    const markupButtons = [];
    for (let i = 0; i < folders.length; i += this.foldersKBColumns) {
      const markupFolderButtonRows = folders
        .map((folder) =>
          Markup.button.callback(
            folder.name + ' 📁',
            createFolderCallbackData(
              EnumFolderActions.NAV,
              folder.id,
              folder.parentId,
            ),
          ),
        )
        .slice(i, i + 3);

      markupButtons.push(markupFolderButtonRows);
    }

    if (footer) markupButtons.push(footerKeyboard(parentId));

    return Markup.inlineKeyboard(markupButtons);
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
