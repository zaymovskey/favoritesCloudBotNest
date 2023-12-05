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

  @On('photo')
  async onPhoto(
    @Ctx()
    ctx: FilesContext<EnumFileTypes.PHOTO> &
      SceneContext &
      Context & { message: { text: string } },
  ) {
    const photo = ctx.update.message.photo;
    const bestQualityPhotoFileId = photo[photo.length - 1].file_id;
    const folderId = ctx.session.folderId;
    const userId = ctx.message.from.id;
    await this.filesService!.addFile(
      userId,
      bestQualityPhotoFileId,
      folderId!,
      EnumFileTypes.PHOTO,
    );

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

  @On('video')
  async onVideo(
    @Ctx() ctx: FilesContext<EnumFileTypes.VIDEO> & SceneContext & Context,
  ) {
    console.log(ctx.update.message);
    await ctx.scene.leave();
  }

  @On('audio')
  async onAudio(
    @Ctx() ctx: FilesContext<EnumFileTypes.AUDIO> & SceneContext & Context,
  ) {
    console.log(ctx);
    await ctx.scene.leave();
  }

  @On('document')
  async onDocument(
    @Ctx() ctx: FilesContext<EnumFileTypes.DOCUMENT> & SceneContext & Context,
  ) {
    console.log(ctx);
    await ctx.scene.leave();
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
    const remainingQuestionMessage = ctx.session.messagesToDelete.find(
      (message) => message.is_duplicate,
    );
    const duplicateQuestionMessageId = ctx.session.messagesToDelete.find(
      (message) =>
        message.id != remainingQuestionMessage?.id && message.is_duplicate,
    )?.id;
    ctx.session.messagesToDelete = ctx.session.messagesToDelete.filter(
      (message) => message.id !== duplicateQuestionMessageId,
    );
    return duplicateQuestionMessageId;
  }
}
