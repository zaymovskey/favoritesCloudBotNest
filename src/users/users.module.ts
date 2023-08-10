import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { StartCommand } from './commands/start.command';
import { FoldersService } from '../folders/folders.service';
import { Folder } from '../folders/folders.model';

@Module({
  providers: [UsersService, FoldersService, StartCommand],
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Folder]),
  ],
})
export class UsersModule {}
