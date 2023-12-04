import { Context } from 'telegraf';
import { Update } from 'nestjs-telegraf';
import { FilesContext } from './context.interface';
import { EnumFileTypes } from './files/files.model';

@Update()
export abstract class Command {
  abstract handle(ctx: Context | FilesContext<EnumFileTypes>): void;
}
