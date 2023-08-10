import { DataTypes } from 'sequelize';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Folder } from '../folders/folders.model';
import { File } from '../files/files.model';

export interface IUserCreationAttrs {
  userId: number;
}

@Table({ tableName: 'user' })
export class User extends Model<User, IUserCreationAttrs> {
  @Column({ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataTypes.BIGINT, unique: true })
  userId: number;

  // TODO: Создать отдельную таблицу забаненных пользователей
  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataTypes.STRING, allowNull: true })
  banReason: string;

  @HasMany(() => Folder, {
    foreignKey: 'userId',
    sourceKey: 'userId',
    keyType: DataTypes.BIGINT,
  })
  folders: Folder[];

  @HasMany(() => File, {
    foreignKey: 'userId',
    sourceKey: 'userId',
    keyType: DataTypes.BIGINT,
  })
  files: File[];
}
