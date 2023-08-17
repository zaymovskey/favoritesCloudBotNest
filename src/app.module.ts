import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { File } from './files/files.model';
import { Folder } from './folders/folders.model';
import RedisSession from 'telegraf-session-redis';

const configService = new ConfigService();

const session = new RedisSession({
  store: {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_HOST'),
  },
});

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
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
