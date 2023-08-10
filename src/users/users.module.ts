import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { StartCommand } from './commands/start.command';

@Module({
  providers: [UsersService, StartCommand],
  imports: [SequelizeModule.forFeature([User])],
})
export class UsersModule {}
