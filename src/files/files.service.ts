import { Injectable } from '@nestjs/common';
import { EnumFileTypes, File } from './files.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepo: typeof File) {}

  async addFile(
    userId: number,
    fileId: string,
    folderId: number,
    type: EnumFileTypes,
  ): Promise<File> {
    return await this.fileRepo.create({
      userId: userId,
      fileId: fileId,
      folderId: folderId,
      type: type,
    });
  }
}
