import { Action, Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context, FilesContext } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../../folders/folders.service';
import { MyScene } from '../../../../scene.class';
import { leaveSceneFooter } from '../../../../keyboards/leaveSceneFooter';
import { EnumFileTypes } from '../../../files.model';
import { FilesService } from '../../../files.service';
import { leaveUploadFilesSceneFooter } from '../../../keyboards/leaveUploadFilesSceneFooter';
import { EnumFilesActions } from '../../../files.interfaces';

@Scene('addFilesScene')
export class UploadFilesScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
    @Inject(FilesService) filesService: FilesService,
  ) {
    super(bot, folderService, filesService);
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    const message = await ctx.reply(
      'Загрузите файлы',
      Markup.inlineKeyboard(leaveSceneFooter()),
    );
    await ctx.answerCbQuery();
    ctx.session.messagesToDelete.push({ id: message.message_id });
  }

  @On([...Object.values(EnumFileTypes)])
  async onFile(
    @Ctx()
    ctx: FilesContext & SceneContext & Context & { message: { text: string } },
  ) {
    const fileType = this.getFileType(ctx);
    const fileId = this.getFileId(fileType, ctx);

    const folderId = ctx.session.folderId;
    const userId = ctx.message.from.id;
    await this.filesService!.addFile(userId, fileId, folderId!, fileType);

    const message = await ctx.reply(
      'Файл успешно загружен. Хотите загрузить еще?',
      Markup.inlineKeyboard(leaveUploadFilesSceneFooter()),
    );

    ctx.session.messagesToDelete.push(
      { id: message.message_id, is_duplicate: true },
      { id: ctx.message.message_id },
    );

    const duplicateQuestionMessageId = await this.getDuplicateQuestionMessageId(
      ctx,
    );
    if (duplicateQuestionMessageId) {
      await this.bot.telegram.deleteMessage(
        ctx.chat!.id,
        duplicateQuestionMessageId,
      );
    }
  }

  @Action(EnumFilesActions.LEAVE_UPLOAD)
  async handle(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ): Promise<void> {
    await this.deleteUselessMessages(ctx);
    await ctx.scene.leave();
  }

  async getDuplicateQuestionMessageId(
    ctx: Context,
  ): Promise<number | undefined> {
    const duplicatesQuestionMessages = ctx.session.messagesToDelete.filter(
      (message) => message.is_duplicate,
    );
    const remainingQuestionMessageId = Math.max(
      ...duplicatesQuestionMessages.map((message) => message.id),
    );
    const duplicateQuestionMessageId = ctx.session.messagesToDelete.find(
      (message) =>
        message.id != remainingQuestionMessageId && message.is_duplicate,
    )?.id;
    ctx.session.messagesToDelete = ctx.session.messagesToDelete.filter(
      (message) => message.id !== duplicateQuestionMessageId,
    );
    return duplicateQuestionMessageId;
  }

  getFileType(ctx: FilesContext): EnumFileTypes {
    let fileType: EnumFileTypes;
    if (ctx.update.message.photo) {
      fileType = EnumFileTypes.PHOTO;
    } else if (ctx.update.message.video) {
      fileType = EnumFileTypes.VIDEO;
    } else if (ctx.update.message.audio) {
      fileType = EnumFileTypes.AUDIO;
    } else if (ctx.update.message.document) {
      fileType = EnumFileTypes.DOCUMENT;
    }
    return fileType!;
  }

  getFileId(fileType: EnumFileTypes, ctx: FilesContext) {
    switch (fileType) {
      case EnumFileTypes.PHOTO:
        const photo = ctx.update.message.photo;
        return photo[photo.length - 1].file_id;
      default:
        return ctx.update.message[fileType].file_id;
    }
  }
}
