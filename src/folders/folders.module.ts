import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { FoldersService } from './folders.service';
import { Nav } from './commands/nav';
import { AddFolderEnter } from './commands/scenes/addFolderEnter.command';
import { AddFolderScene } from './commands/scenes/addFolder.scene';

@Module({
  providers: [FoldersService, Nav, AddFolderScene, AddFolderEnter],
  imports: [SequelizeModule.forFeature([Folder])],
})
export class FoldersModule {}
