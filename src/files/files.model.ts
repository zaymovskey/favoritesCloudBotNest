import { DataTypes, literal } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Folder } from '../folders/folders.model';

enum EnumFileTypes {
  PHOTO = 'photo',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
}

interface IFileCreationAttrs {
  userId: number;
  fileId: number;
  fileName: string;
  type: EnumFileTypes;
}

@Table({ tableName: 'file' })
export class File extends Model<File, IFileCreationAttrs> {
  @Column({ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataTypes.BIGINT })
  fileId: number;

  @Column({ type: DataTypes.STRING })
  fileName: string;

  @Column({ type: DataTypes.ENUM(...Object.values(EnumFileTypes)) })
  type: string;

  @ForeignKey(() => User)
  @Column({ type: DataTypes.BIGINT })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Folder)
  @Column
  folderId: number;

  @BelongsTo(() => Folder)
  folder: Folder;

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
