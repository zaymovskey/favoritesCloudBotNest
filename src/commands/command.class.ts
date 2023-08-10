import { Context, Telegraf } from 'telegraf';
import { InjectBot, Update } from 'nestjs-telegraf';
@Update()
export abstract class Command {
  public constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  abstract handle(ctx: Context): void;
}
