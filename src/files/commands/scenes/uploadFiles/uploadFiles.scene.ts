import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context, FilesContext } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../../folders/folders.service';
import { MyScene } from '../../../../scene.class';
import { cancelFooterKeyboard } from '../../../../keyboards/cancelFooter.keyboard';
import { EnumFileTypes } from '../../../files.model';

@Scene('addFilesScene')
export class UploadFilesScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
  ) {
    super(bot, folderService);
  }

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    await ctx.reply(
      'Загрузите файлы',
      Markup.inlineKeyboard(cancelFooterKeyboard()),
    );
  }

  @On('photo')
  async onPhoto(
    @Ctx() ctx: FilesContext<EnumFileTypes.PHOTO> & SceneContext & Context,
  ) {
    const photo = ctx.update.message.photo;
    const bestQualityPhoto = photo[photo.length - 1];
    console.log(bestQualityPhoto);
    await ctx.scene.leave();
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
