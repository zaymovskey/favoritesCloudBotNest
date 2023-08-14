import { Action, Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
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
import { cancelFooterKeyboard } from '../../../../keyboards/cancelFooter.keyboard';

@Scene('renameFolderScene')
export class RenameFolderScene extends MyScene {
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
      folderId: ctx.session.folderId ?? null,
      folderAction: EnumFolderActions.RENAME,
      footer: { visible: true, footerType: EnumFooterTypes.CANCEL_FOOTER },
    });

    void ctx.reply('Выберите папку, которую хотите переименовать', folderKB);
  }

  @Action(folderActionRegexps.rename)
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    ctx.session.folderId = data.subjectId!;

    await ctx.reply(
      'Введите новое имя',
      Markup.inlineKeyboard(cancelFooterKeyboard()),
    );
  }

  @On('text')
  async onAnswer2(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const newFolderName = ctx.message.text;
    const folderId = ctx.session.folderId!;
    const userId = ctx.message.from.id;

    const renamedFolder = await this.folderService.renameFolder(
      folderId,
      newFolderName,
    );

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: userId,
        folderId: renamedFolder.parentId,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }
}
