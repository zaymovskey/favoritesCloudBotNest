import { DataTypes } from 'sequelize';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { File } from '../files/files.model';

interface IFolderCreationAttrs {
  userId: number;
  name: string;
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

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Folder, 'parentId')
  parent: Folder;

  @HasMany(() => Folder, 'parentId')
  children: Folder[];

  @HasMany(() => File, 'folderId')
  files: File[];
}
