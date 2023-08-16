import { Command } from '../../../../command.class';
import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { folderActionRegexps } from '../../../folders.interfaces';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';

export class RemoveFolderEnterCommand extends Command {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    super();
  }

  @Action(folderActionRegexps.remove)
  async handle(
    @Ctx() ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ): Promise<void> {
    await ctx.scene.enter('removeFolderScene');
  }
}
