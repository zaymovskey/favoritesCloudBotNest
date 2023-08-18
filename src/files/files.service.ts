import { Injectable } from '@nestjs/common';
import { File } from './files.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private userRepo: typeof File) {}
}
