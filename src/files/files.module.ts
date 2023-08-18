import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';
import { UploadFileCommand } from './commands/uploadFile.command';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService, UploadFileCommand],
  imports: [SequelizeModule.forFeature([File])],
})
export class FilesModule {}
