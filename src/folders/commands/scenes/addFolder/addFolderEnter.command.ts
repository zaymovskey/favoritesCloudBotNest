import { Command } from '../../../../command.class';
import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { folderActionRegexps } from '../../../folders.interfaces';
import { SceneContext } from 'telegraf/typings/scenes';

export class AddFolderEnterCommand extends Command {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
    super();
  }

  @Action(folderActionRegexps.add_folder)
  async handle(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('addFolderScene');
  }
}
