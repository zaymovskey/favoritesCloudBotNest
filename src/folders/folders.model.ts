import { DataTypes, literal } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { File } from '../files/files.model';

interface IFolderCreationAttrs {
  userId: number;
  name: string;
  parentId: number | null;
}

@Table({
  tableName: 'folder',
  indexes: [{ fields: ['userId', 'parentId', 'name'], unique: true }],
})
export class Folder extends Model<Folder, IFolderCreationAttrs> {
  @Column({ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataTypes.STRING })
  name: string;

  @ForeignKey(() => User)
  @Column({ type: DataTypes.BIGINT })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => File)
  files: File[];

  @ForeignKey(() => Folder)
  parentId: number | null;

  @BelongsTo(() => Folder)
  parent: Folder;

  @HasMany(() => Folder)
  children: Folder[];

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
