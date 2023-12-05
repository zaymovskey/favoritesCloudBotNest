import { Action, Ctx, InjectBot, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { EnumFooterTypes, FoldersService } from '../../../folders.service';
import { Update } from 'telegraf/typings/core/types/typegram';
import {
  EnumFolderActions,
  folderActionRegexps,
} from '../../../folders.interfaces';
import { getCallbackQueryData } from '../../../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../../../utils/createCallbackData.util';
import { MyScene } from '../../../../scene.class';

@Scene('removeFolderScene')
export class RemoveFolderScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
  ) {
    super(bot, folderService);
  }

  @SceneEnter()
  async enter(
    @Ctx() ctx: Context & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB] = await this.folderService.getDirectoryFoldersAndPath({
      userId: ctx.update.callback_query.from.id,
      folderId: ctx.session.folderId,
      folderAction: EnumFolderActions.REMOVE,
      footer: { visible: true, footerType: EnumFooterTypes.CANCEL_FOOTER },
    });

    const message = await ctx.reply(
      'Выберите папку, которую хотите удалить',
      folderKB,
    );
    await this.pushMessageIdToMessagesToDelete(ctx, message);
  }

  @Action(folderActionRegexps.remove_folder)
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    await this.folderService.removeFolder(data.subjectId!);

    const [folderKB] = await this.folderService.getDirectoryFoldersAndPath({
      userId: callbackQueryData!.from.id,
      folderId: ctx.session.folderId,
    });

    await this.deleteUselessMessages(ctx);

    await this.bot.telegram.editMessageReplyMarkup(
      ctx.chat!.id,
      ctx.session.mainMessageId,
      undefined,
      folderKB.reply_markup,
    );

    await ctx.scene.leave();
  }
}
