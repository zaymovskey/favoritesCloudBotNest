import { Context } from 'telegraf';
import { Start } from 'nestjs-telegraf';
import { Command } from './command.class';

export class StartCommand extends Command {
  @Start()
  handle(ctx: Context): void {
    void ctx.reply('Тест1');
  }
}
