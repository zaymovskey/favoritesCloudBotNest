import { Injectable } from '@nestjs/common';
import { IUserCreationAttrs, User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}

  async createUser(data: IUserCreationAttrs): Promise<[User, boolean]> {
    return await this.userRepo.findOrCreate({
      where: { userId: data.userId },
    });
  }
}
