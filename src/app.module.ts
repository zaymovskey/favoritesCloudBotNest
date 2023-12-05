import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { File } from './files/files.model';
import { Folder } from './folders/folders.model';
import { FilesModule } from './files/files.module';
import { Redis } from '@telegraf/session/redis';
import { session } from 'telegraf';
const store = Redis({
  url: 'redis://127.0.0.1:6379',
});

const configService = new ConfigService();
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => {
        return {
          middlewares: [session({ store })],
          token: configService.get('TG_TOKEN'),
        };
      },
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
    FilesModule,
  ],
})
export class AppModule {}
