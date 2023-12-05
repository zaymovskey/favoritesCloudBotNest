import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';
import { FilesService } from './files.service';
import { UploadFilesScene } from './commands/scenes/uploadFiles/uploadFiles.scene';
import { UploadFilesEnterCommand } from './commands/scenes/uploadFiles/uploadFilesEnter.command';
import { Folder } from '../folders/folders.model';
import { FoldersService } from '../folders/folders.service';
import { GetFolderFilesScene } from './commands/scenes/getFolderFiles/getFolderFiles.scene';
import { GetFolderFilesEnterScene } from './commands/scenes/getFolderFiles/getFolderFilesEnter.scene';

@Module({
  providers: [
    FilesService,
    FoldersService,
    UploadFilesScene,
    UploadFilesEnterCommand,
    GetFolderFilesScene,
    GetFolderFilesEnterScene,
  ],
  imports: [
    SequelizeModule.forFeature([File]),
    SequelizeModule.forFeature([Folder]),
  ],
})
export class FilesModule {}
