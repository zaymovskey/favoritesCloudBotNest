import { Command } from '../../command.class';
import { Action, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../folders.service';
import { getCallbackQueryData } from '../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../utils/createCallbackData.util';
import { folderActionRegexps } from '../folders.interfaces';

export class Nav extends Command {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @Inject(FoldersService)
    private folderService: FoldersService,
  ) {
    super();
  }

  @Action(folderActionRegexps.nav_folder)
  async handle(ctx: Context) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    ctx.session.folderId = data.subjectId;

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: callbackQueryData!.from.id,
        folderId: data.subjectId,
      });

    await this.bot.telegram.editMessageText(
      ctx.chat!.id,
      ctx.session.mainMessageId,
      undefined,
      path,
    );
    await this.bot.telegram.editMessageReplyMarkup(
      ctx.chat!.id,
      ctx.session.mainMessageId,
      undefined,
      folderKB.reply_markup,
    );
  }
}
