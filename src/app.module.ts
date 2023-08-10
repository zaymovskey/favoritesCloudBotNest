import { Module } from '@nestjs/common';
import * as LocalSession from 'telegraf-session-local';
import { ConfigService } from './config/config.service';
import { StartCommand } from './commands/start.command';
import { HearCommand } from './commands/hear.command';
import { TelegrafModule } from 'nestjs-telegraf';
import { databaseProvider } from './database.provider';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';

const sessions = new LocalSession({ database: 'session_db.json' });
const configService = new ConfigService();

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: configService.get('TG_TOKEN'),
    }),
    UsersModule,
    FoldersModule,
  ],
  providers: [StartCommand, HearCommand, databaseProvider],
})
export class AppModule {}
