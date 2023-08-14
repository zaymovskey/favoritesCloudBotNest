import { Action, Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { Update } from 'telegraf/typings/core/types/typegram';
import { cancelFooterKeyboard } from '../../../../keyboards/cancelFooter.keyboard';

@Scene('addFolderScene')
export class AddFolderScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    private folderService: FoldersService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    await ctx.reply(
      'Введите название папки',
      Markup.inlineKeyboard(cancelFooterKeyboard()),
    );
  }

  @On('text')
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const folderName = ctx.message.text;
    const parentId = ctx.session.folderId ?? null;
    const userId = ctx.message.from.id;

    const newFolder = await this.folderService.addFolder(
      userId,
      parentId,
      folderName,
    );
    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: userId,
        folderId: newFolder.parentId,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }

  @Action('cancel')
  async cancel(
    @Ctx()
    ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: ctx.update.callback_query.from.id,
        folderId: ctx.session.folderId ?? null,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }
}
