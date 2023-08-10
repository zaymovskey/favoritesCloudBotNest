import { DataTypes } from 'sequelize';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
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

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Folder, 'folderId')
  folder: Folder;
}
