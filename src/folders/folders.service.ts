import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { Markup } from 'telegraf';
import { createFolderCallbackData } from './utils/createFolderCallbackData';
import { EnumFolderActions } from './folders.interfaces';
import { folderFooterKeyboard } from './keyboards/folderFooterKeyboard';
import { cancelFooterKeyboard } from '../keyboards/cancelFooter.keyboard';
import { where } from 'sequelize';

export enum EnumFooterTypes {
  FOLDERS_FOOTER = 'folders_footer',
  CANCEL_FOOTER = 'cancel_footer',
}

export interface IGetDirectoryFoldersAndPathArgs {
  userId: number;
  folderId: number | null;
  folderAction?: EnumFolderActions;
  footer?: {
    visible: boolean;
    footerType: EnumFooterTypes;
  };
}

@Injectable()
export class FoldersService {
  readonly foldersKBColumns = 3;
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  async renameFolder(folderId: number, newName: string) {
    const renamingFolder = await this.folderRepo.findOne({
      where: {
        id: folderId,
      },
    });

    renamingFolder!.name = newName;
    await renamingFolder!.save();

    return renamingFolder!;
  }

  async removeFolder(folderId: number): Promise<void> {
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

  async getDirectoryFoldersAndPath({
    userId,
    folderId = null,
    folderAction = EnumFolderActions.NAV,
    footer = { visible: true, footerType: EnumFooterTypes.FOLDERS_FOOTER },
  }: IGetDirectoryFoldersAndPathArgs) {
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
      footer.visible,
      folderAction,
      footer.footerType,
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
        // TODO: Вот это точно надо отрефакторить
        .map((folder) =>
          Markup.button.callback(
            folder.name + ' 📁',
            createFolderCallbackData(folderAction, folder.id, folder.parentId),
          ),
        )
        .slice(i, i + this.foldersKBColumns);

      markupButtons.push(markupFolderButtonRows);
    }

    if (footerType === EnumFooterTypes.FOLDERS_FOOTER) {
      markupButtons.push(...folderFooterKeyboard(parentId, folderId));
    } else if (footerType === EnumFooterTypes.CANCEL_FOOTER) {
      markupButtons.push(cancelFooterKeyboard());
    }

    // TODO: Вот это точно надо отрефакторить
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
