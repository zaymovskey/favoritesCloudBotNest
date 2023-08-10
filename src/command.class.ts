import { Context } from 'telegraf';
import { Update } from 'nestjs-telegraf';

@Update()
export abstract class Command {
  abstract handle(ctx: Context): void;
}
