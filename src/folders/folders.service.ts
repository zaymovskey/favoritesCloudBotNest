import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Folder } from './folders.model';

@Injectable()
export class FoldersService {
  constructor(@InjectModel(Folder) private userRepo: typeof Folder) {}
}
