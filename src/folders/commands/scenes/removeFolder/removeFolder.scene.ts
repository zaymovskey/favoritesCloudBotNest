import { Action, Ctx, InjectBot, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { Update } from 'telegraf/typings/core/types/typegram';
import {
  EnumFolderActions,
  folderActionRegexps,
} from '../../../folders.interfaces';
import { getCallbackQueryData } from '../../../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../../../utils/createCallbackData.util';

@Scene('removeFolderScene')
export class RemoveFolderScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    private folderService: FoldersService,
  ) {}

  @SceneEnter()
  async enter(
    @Ctx() ctx: Context & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB] = await this.folderService.getDirectoryFoldersAndPath(
      ctx.update.callback_query.from.id,
      ctx.session.folderId,
      false,
      EnumFolderActions.REMOVE,
      'cancel_footer',
    );

    void ctx.reply('Выберите папку, которую хотите удалить', folderKB);
  }

  @Action(folderActionRegexps.remove)
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    await this.folderService.removeFolder(data.subjectId!);

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath(
        callbackQueryData!.from.id,
        ctx.session.folderId,
      );

    void ctx.reply(path, folderKB);

    await ctx.scene.leave();
  }

  @Action('cancel')
  async cancel(
    @Ctx()
    ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath(
        ctx.update.callback_query.from.id,
        ctx.session.folderId,
      );

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }
}