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

  @Action(folderActionRegexps.nav)
  async handle(ctx: Context) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath(
        callbackQueryData!.from.id,
        data.subjectId,
      );

    void ctx.reply(path, folderKB);
  }
}
