import { Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Command } from './command.class';

export class HearCommand extends Command {
  @Hears('тест')
  handle(ctx: Context): void {
    void ctx.reply('Тест2');
  }
}
