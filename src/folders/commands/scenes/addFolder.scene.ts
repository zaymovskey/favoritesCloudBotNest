import { Ctx, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Telegraf } from 'telegraf';
import { Context } from '../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../folders.service';

@Scene('addFolderScene')
export class AddFolderScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    private folderService: FoldersService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: Context) {
    await ctx.reply('Введите название папки', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Отмена', callback_data: '4' }]],
      },
    });
  }

  @On('text')
  async onAnswer(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const folderName = ctx.message.text;
    const parentId = ctx.session.folderId ?? null;
    const userId = ctx.message.from.id;

    await this.folderService.addFolder(userId, parentId, folderName);

    await ctx.scene.leave();
  }
}
