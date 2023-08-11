import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';

@Injectable()
export class FoldersService {
  constructor(@InjectModel(Folder) private folderRepo: typeof Folder) {}

  async getUserFolderKB(
    userId: number,
    parentId: number | null = null,
  ): Promise<void> {
    console.log(parentId);
    const folders = await this.folderRepo.findAll({
      where: {
        userId: userId,
        parentId: parentId,
      },
      order: ['name'],
    });
    console.log(folders);
  }
}
