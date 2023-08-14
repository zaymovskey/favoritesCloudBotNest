import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { FoldersService } from './folders.service';
import { Nav } from './commands/nav';
import { AddFolderEnterCommand } from './commands/scenes/addFolder/addFolderEnter.command';
import { AddFolderScene } from './commands/scenes/addFolder/addFolder.scene';
import { RemoveFolderEnterCommand } from './commands/scenes/removeFolder/removeFolderEnter.command';
import { RemoveFolderScene } from './commands/scenes/removeFolder/removeFolder.scene';
import { RenameFolderScene } from './commands/scenes/renameFolder/renameFolder.scene';
import { RenameFolderEnterCommand } from './commands/scenes/renameFolder/renameFolderEnter.scene';

@Module({
  providers: [
    FoldersService,
    Nav,
    AddFolderScene,
    AddFolderEnterCommand,
    RemoveFolderScene,
    RemoveFolderEnterCommand,
    RenameFolderScene,
    RenameFolderEnterCommand,
  ],
  imports: [SequelizeModule.forFeature([Folder])],
})
export class FoldersModule {}
