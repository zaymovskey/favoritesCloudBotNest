import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { cancelFooterKeyboard } from '../../../../keyboards/cancelFooter.keyboard';
import { MyScene } from '../../../../scene.class';

@Scene('addFolderScene')
export class AddFolderScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
  ) {
    super(bot, folderService);
  }

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
}
