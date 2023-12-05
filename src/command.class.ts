import { Context } from 'telegraf';
import { Update } from 'nestjs-telegraf';
import { FilesContext } from './context.interface';

@Update()
export abstract class Command {
  abstract handle(ctx: Context | FilesContext): void;
}
