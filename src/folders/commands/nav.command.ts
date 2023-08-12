import { Command } from '../../command.class';
import { Action, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../folders.service';
import { getCallbackQueryData } from '../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../utils/createCallbackData.util';

export class NavCommand extends Command {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @Inject(FoldersService)
    private folderService: FoldersService,
  ) {
    super();
  }

  @Action(/navAhead(.+)/)
  async handle(ctx: Context) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);
    const childFolders = await this.folderService.getFolders(
      callbackQueryData!.from.id,
      data.subjectId,
    );
    const folderKB = this.folderService.createFoldersKB(childFolders);
    void ctx.reply('/', folderKB);
  }
}
