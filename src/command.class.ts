import { Context } from 'telegraf';
import { Update } from 'nestjs-telegraf';
import { PhotoContext } from './context.interface';

@Update()
export abstract class Command {
  abstract handle(ctx: Context | PhotoContext): void;
}
