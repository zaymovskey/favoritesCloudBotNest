import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Folder } from './folders.model';
import { FoldersService } from './folders.service';

@Module({
  providers: [FoldersService],
  imports: [SequelizeModule.forFeature([Folder])],
})
export class FoldersModule {}
