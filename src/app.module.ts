import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';

const sessions = new LocalSession({ database: 'session_db.json' });
const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: configService.get('TG_TOKEN'),
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
