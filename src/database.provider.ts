import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from './config/config.service';
import { User } from './users/users.model';
import { Folder } from './folders/folders.model';
import { File } from './files/files.model';

const configService = new ConfigService();

export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: configService.get('PG_HOST'),
      port: Number(configService.get('PG_PORT')),
      username: configService.get('PG_USERNAME'),
      password: configService.get('PG_PASSWORD'),
      database: configService.get('PG_DATABASE_NAME'),
    });
    sequelize.addModels([User, File, Folder]);
    await sequelize.sync();
    return sequelize;
  },
};
