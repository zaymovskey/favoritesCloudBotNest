import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context, FilesContext } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../../folders/folders.service';
import { MyScene } from '../../../../scene.class';
import { leaveSceneFooter } from '../../../../keyboards/leaveSceneFooter';
import { EnumFileTypes } from '../../../files.model';
import { FilesService } from '../../../files.service';

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
    await ctx.reply(
      'Загрузите файлы',
      Markup.inlineKeyboard(leaveSceneFooter()),
    );
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

    await ctx.reply(
      'Файл успешно загружен. Хотите завершить загрузку файлов?',
      Markup.inlineKeyboard(leaveSceneFooter('Завершить')),
    );
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
}
