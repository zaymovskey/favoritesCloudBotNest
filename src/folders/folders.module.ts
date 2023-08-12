import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { FoldersService } from './folders.service';
import { NavCommand } from './commands/nav.command';

@Module({
  providers: [FoldersService, NavCommand],
  imports: [SequelizeModule.forFeature([Folder])],
})
export class FoldersModule {}
