import { Command } from '../../command.class';
import { Action, InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from '../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../folders/folders.service';
import { getCallbackQueryData } from '../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../utils/createCallbackData.util';
import { EnumFilesActions } from '../files.interfaces';
import { FilesService } from '../files.service';

export class GetFolderFilesCommand extends Command {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @Inject(FoldersService)
    private folderService: FoldersService,
    private filesService: FilesService,
  ) {
    super();
  }

  @Action(EnumFilesActions.GET)
  async handle(ctx: Context) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);
    const folderId = ctx.session.folderId!;

    const folderFiles = await this.filesService.getDirectoryFiles(folderId);

    await Promise.all(
      folderFiles.map(async (file) => {
        await ctx.sendPhoto(file.fileId);
      }),
    );

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: callbackQueryData!.from.id,
        folderId: folderId,
      });

    void ctx.reply(path, folderKB);
  }
}
