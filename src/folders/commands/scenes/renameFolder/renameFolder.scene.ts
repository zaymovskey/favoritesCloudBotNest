import { Ctx, InjectBot, On, Scene } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { MyScene } from '../../../../scene.class';

@Scene('renameFolderScene')
export class RenameFolderScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
  ) {
    super(bot, folderService);
  }

  @On('text')
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const newFolderName = ctx.message.text;
    const folderId = ctx.session.processedFolderId!;
    const userId = ctx.message.from.id;

    const renamedFolder = await this.folderService.renameFolder(
      folderId,
      newFolderName,
    );

    const [folderKB] = await this.folderService.getDirectoryFoldersAndPath({
      userId: userId,
      folderId: renamedFolder.parentId,
    });

    await ctx.deleteMessage();
    await this.deleteUselessMessages(ctx);

    await this.bot.telegram.editMessageReplyMarkup(
      ctx.chat!.id,
      ctx.session.mainMessageId,
      undefined,
      folderKB.reply_markup,
    );

    ctx.session.processedFolderId = null;
    await ctx.scene.leave();
  }
}
