import { Command } from '../../../../command.class';
import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { SceneContext } from 'telegraf/typings/scenes';
import { EnumFilesActions } from '../../../files.interfaces';

export class GetFolderFilesEnterScene extends Command {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    super();
  }

  @Action(EnumFilesActions.GET)
  async handle(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.scene.enter('getFolderFilesScene');
  }
}
