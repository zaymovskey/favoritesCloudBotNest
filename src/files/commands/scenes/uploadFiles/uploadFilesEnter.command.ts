import { Command } from '../../../../command.class';
import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { SceneContext } from 'telegraf/typings/scenes';
import { EnumFilesActions } from '../../../files.interfaces';

export class UploadFilesEnterCommand extends Command {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    super();
  }

  @Action('add_files')
  async handle(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('addFilesScene');
  }
}
