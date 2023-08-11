import { DataTypes, literal } from 'sequelize';
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

  @HasMany(() => Folder, { sourceKey: 'userId' })
  folders: Folder[];

  @HasMany(() => File, { sourceKey: 'userId' })
  files: File[];

  @Column({
    type: DataTypes.DATE,
    defaultValue: literal('NOW()'),
  })
  createdAt: DataTypes.DateDataType;

  @Column({
    type: DataTypes.DATE,
    defaultValue: literal('NOW()'),
  })
  updatedAt: DataTypes.DateDataType;
}
