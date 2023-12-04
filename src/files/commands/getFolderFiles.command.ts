import { Command } from '../../command.class';
import { Action, InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { Context } from '../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../folders/folders.service';
import { getCallbackQueryData } from '../../utils/getCallbackQueryData.util';
import { EnumFilesActions } from '../files.interfaces';
import { FilesService } from '../files.service';
import { EnumFileTypes } from '../files.model';
import { fileActionsKeyboard } from '../keyboards/fileActionsKeyboard';
import { sendSeparatorMessage } from '../../utils/sendSeparatorMessage';

type availableSendFileMethods =
  | 'sendPhoto'
  | 'sendDocument'
  | 'sendAudio'
  | 'sendVideo';

const sendFileMethodNames: Record<EnumFileTypes, availableSendFileMethods> = {
  [EnumFileTypes.PHOTO]: 'sendPhoto',
  [EnumFileTypes.DOCUMENT]: 'sendDocument',
  [EnumFileTypes.AUDIO]: 'sendAudio',
  [EnumFileTypes.VIDEO]: 'sendVideo',
};

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
    const folderId = ctx.session.folderId!;

    const folderFiles = await this.filesService.getDirectoryFiles(folderId);

    await sendSeparatorMessage(ctx);

    await Promise.all(
      folderFiles.map(async (file) => {
        const fileType = file.type;
        await ctx[sendFileMethodNames[fileType]](
          file.fileId,
          Markup.inlineKeyboard(fileActionsKeyboard()),
        );
      }),
    );

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: callbackQueryData!.from.id,
        folderId: folderId,
      });

    await sendSeparatorMessage(ctx);

    void ctx.reply(path, folderKB);
  }
}
