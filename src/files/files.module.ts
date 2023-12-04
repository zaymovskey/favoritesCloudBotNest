import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';
import { FilesService } from './files.service';
import { UploadFilesScene } from './commands/scenes/uploadFiles/uploadFiles.scene';
import { UploadFilesEnterCommand } from './commands/scenes/uploadFiles/uploadFilesEnter.command';
import { Folder } from '../folders/folders.model';
import { FoldersService } from '../folders/folders.service';

@Module({
  providers: [
    FilesService,
    FoldersService,
    UploadFilesScene,
    UploadFilesEnterCommand,
  ],
  imports: [
    SequelizeModule.forFeature([File]),
    SequelizeModule.forFeature([Folder]),
  ],
})
export class FilesModule {}
