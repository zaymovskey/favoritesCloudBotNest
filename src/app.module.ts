import { Module } from '@nestjs/common';
import * as LocalSession from 'telegraf-session-local';
import { ConfigService } from './config/config.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { File } from './files/files.model';
import { Folder } from './folders/folders.model';

const sessions = new LocalSession({ database: 'session_db.json' });
const configService = new ConfigService();

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: configService.get('TG_TOKEN'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configService.get('PG_HOST'),
      port: Number(configService.get('PG_PORT')),
      username: configService.get('PG_USERNAME'),
      password: configService.get('PG_PASSWORD'),
      database: configService.get('PG_DATABASE_NAME'),
      models: [User, File, Folder],
      autoLoadModels: true,
    }),
    UsersModule,
    FoldersModule,
  ],
})
export class AppModule {}
