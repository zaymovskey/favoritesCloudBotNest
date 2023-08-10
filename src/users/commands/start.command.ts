import { Context } from 'telegraf';
import { Start } from 'nestjs-telegraf';
import { Command } from '../../command.class';
import { UsersService } from '../users.service';
import { Inject } from '@nestjs/common';

export class StartCommand extends Command {
  constructor(@Inject(UsersService) private userService: UsersService) {
    super();
  }

  @Start()
  handle(ctx: Context): void {
    this.userService.createUser({ userId: ctx.message!.from.id });
    void ctx.reply('Тест1');
  }
}
