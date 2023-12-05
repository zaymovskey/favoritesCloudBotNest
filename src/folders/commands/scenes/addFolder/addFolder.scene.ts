import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { leaveSceneFooter } from '../../../../keyboards/leaveSceneFooter';
import { MyScene } from '../../../../scene.class';
import { fileActionsKeyboard } from '../../../../files/keyboards/fileActionsKeyboard';

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
    const message = await ctx.reply(
      'Введите название папки',
      Markup.inlineKeyboard(leaveSceneFooter()),
    );
    const newMessagesIdToDelete = [...ctx.session.messagesIdToDelete];
    newMessagesIdToDelete.push(message.message_id);
    ctx.session.messagesIdToDelete = newMessagesIdToDelete;
  }

  @On('text')
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const folderName = ctx.message.text;
    const parentId = ctx.session.folderId;
    const userId = ctx.message.from.id;

    const newFolder = await this.folderService.addFolder(
      userId,
      parentId,
      folderName,
    );
    const [folderKB] = await this.folderService.getDirectoryFoldersAndPath({
      userId: userId,
      folderId: newFolder.parentId,
    });

    await ctx.deleteMessage();
    await Promise.all(
      ctx.session.messagesIdToDelete.map(async (messageId) => {
        await this.bot.telegram.deleteMessage(ctx.chat!.id, messageId);
      }),
    );
    ctx.session.messagesIdToDelete = [];
    await this.bot.telegram.editMessageReplyMarkup(
      ctx.chat!.id,
      ctx.session.mainMessageId,
      undefined,
      folderKB.reply_markup,
    );

    await ctx.scene.leave();
  }
}
