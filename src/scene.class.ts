import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Context } from './context.interface';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { FoldersService } from './folders/folders.service';
import { FilesService } from './files/files.service';
import { Message } from 'typegram';

export abstract class MyScene {
  protected constructor(
    @InjectBot() protected readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    protected folderService: FoldersService,
    protected filesService?: FilesService,
  ) {}
  @Action('cancel')
  async cancel(
    @Ctx()
    ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: ctx.update.callback_query.from.id,
        folderId: ctx.session.folderId,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }

  async pushMessageIdToMessagesToDelete(ctx: Context, message: Message) {
    const newMessagesIdToDelete = [...ctx.session.messagesIdToDelete];
    newMessagesIdToDelete.push(message.message_id);
    ctx.session.messagesIdToDelete = newMessagesIdToDelete;
  }

  async deleteUselessMessages(ctx: Context) {
    await Promise.all(
      ctx.session.messagesIdToDelete.map(async (messageId) => {
        await this.bot.telegram.deleteMessage(ctx.chat!.id, messageId);
      }),
    );
    ctx.session.messagesIdToDelete = [];
  }
}
