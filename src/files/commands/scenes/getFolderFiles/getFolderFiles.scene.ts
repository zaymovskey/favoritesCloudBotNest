import { Action, Ctx, InjectBot, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../../folders/folders.service';
import { MyScene } from '../../../../scene.class';
import { FilesService } from '../../../files.service';
import { fileActionsKeyboard } from '../../../keyboards/fileActionsKeyboard';
import { EnumFileTypes } from '../../../files.model';
import { leaveGetFolderFilesSceneKeyboard } from '../../../keyboards/leaveGetFolderFilesSceneKeyboard';
import { EnumFilesActions, fileActionRegexps } from '../../../files.interfaces';
import { SceneContext } from 'telegraf/typings/scenes';
import { folderActionRegexps } from '../../../../folders/folders.interfaces';
import { getCallbackQueryData } from '../../../../utils/getCallbackQueryData.util';
import { createCallbackData } from '../../../../utils/createCallbackData.util';

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

@Scene('getFolderFilesScene')
export class GetFolderFilesScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
    @Inject(FilesService) filesService: FilesService,
  ) {
    super(bot, folderService, filesService);
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const folderId = ctx.session.folderId!;

    const folderFiles = await this.filesService!.getDirectoryFiles(folderId);

    await Promise.all(
      folderFiles.map(async (file) => {
        const fileType = file.type;
        const message = await ctx[sendFileMethodNames[fileType]](
          file.fileId,
          Markup.inlineKeyboard(fileActionsKeyboard(file.id)),
        );
        ctx.session.messagesToDelete.push({ id: message.message_id });
      }),
    );

    const message = await ctx.reply(
      'Скрыть файлы?',
      Markup.inlineKeyboard(leaveGetFolderFilesSceneKeyboard()),
    );
    ctx.session.messagesToDelete.push({ id: message.message_id });
  }

  @Action(EnumFilesActions.LEAVE_GET)
  async handle(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ): Promise<void> {
    await this.deleteUselessMessages(ctx);
    await ctx.scene.leave();
  }

  @Action(fileActionRegexps.remove_files!)
  async removeFile(ctx: Context) {
    const callbackQueryData = getCallbackQueryData(ctx);
    const data = createCallbackData(callbackQueryData!.data);

    const fileIdDB = data.subjectId!;
    const fileMessageToDeleteId = callbackQueryData!.message!.message_id;

    ctx.session.messagesToDelete = ctx.session.messagesToDelete.filter(
      (message) => message.id !== fileMessageToDeleteId,
    );

    await this.filesService!.deleteFile(fileIdDB);
    await this.bot.telegram.deleteMessage(ctx.chat!.id, fileMessageToDeleteId);
  }
}
