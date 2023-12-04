import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Markup, Telegraf } from 'telegraf';
import { Context, PhotoContext } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../../folders/folders.service';
import { MyScene } from '../../../../scene.class';
import { cancelFooterKeyboard } from '../../../../keyboards/cancelFooter.keyboard';

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
  async onPhoto(ctx: PhotoContext & SceneContext & Context) {
    const photo = ctx.update.message.photo;
    const bestQualityPhoto = photo[photo.length - 1];
    console.log(bestQualityPhoto);
    await ctx.scene.leave();
  }

  @On('video')
  async onVideo(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    console.log(ctx);
    await ctx.scene.leave();
  }

  @On('audio')
  async onAudio(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    console.log(ctx);
    await ctx.scene.leave();
  }

  @On('document')
  async onDocument(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    console.log(ctx);
    await ctx.scene.leave();
  }
}
