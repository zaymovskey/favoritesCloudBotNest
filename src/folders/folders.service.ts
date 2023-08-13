import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';
import { createFolderCallbackData } from './utils/createFolderCallbackData';
import { EnumFolderActions } from './folders.interfaces';
import { folderFooterKeyboard } from './keyboards/folderFooterKeyboard';
import { cancelFooterKeyboard } from '../keyboards/cancelFooter.keyboard';

@Injectable()
export class FoldersService {
  readonly foldersKBColumns = 3;
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  async removeFolder(folderId: number) {
    await this.folderRepo.destroy({
      where: {
        id: folderId,
      },
    });
  }

  async addFolder(
    userId: number,
    parentId: number | null = null,
    name: string,
  ): Promise<Folder> {
    return await this.folderRepo.create({
      userId: userId,
      parentId: parentId,
      name: name,
    });
  }

  async getDirectoryFoldersAndPath(
    userId: number,
    folderId: number | null = null,
    footer: boolean = true,
    folderAction: EnumFolderActions = EnumFolderActions.NAV,
    footerType: string = 'folders_footer',
  ) {
    const allUserFolders = await this.folderRepo.findAll({
      where: {
        userId: userId,
      },
    });

    const parentId =
      allUserFolders.find((folder) => folder.id === folderId)?.parentId ?? null;

    const foldersKB = this.createFoldersKB(
      allUserFolders.filter((folder) => folder.parentId === folderId),
      parentId,
      folderId,
      footer,
      folderAction,
      footerType,
    );
    const path = this.createFolderPath(allUserFolders, folderId, folderId);

    return [foldersKB, path] as const;
  }

  createFoldersKB(
    folders: Folder[],
    parentId: number | null,
    folderId: number | null,
    footer: boolean,
    folderAction: EnumFolderActions,
    footerType: string,
  ) {
    const markupButtons = [];
    for (let i = 0; i < folders.length; i += this.foldersKBColumns) {
      const markupFolderButtonRows = folders
        .map((folder) =>
          Markup.button.callback(
            folder.name + ' 📁',
            createFolderCallbackData(folderAction, folder.id, folder.parentId),
          ),
        )
        .slice(i, i + 3);

      markupButtons.push(markupFolderButtonRows);
    }

    if (footerType === 'folders_footer') {
      markupButtons.push(folderFooterKeyboard(parentId, folderId));
    } else if (footerType === 'cancel_footer') {
      markupButtons.push(cancelFooterKeyboard());
    }

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
