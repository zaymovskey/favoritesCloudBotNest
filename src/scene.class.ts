import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Context } from './context.interface';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { FoldersService } from './folders/folders.service';
import { FilesService } from './files/files.service';

export abstract class MyScene {
  protected constructor(
    @InjectBot() protected readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    protected folderService: FoldersService,
    protected filesService?: FilesService,
  ) {}
  @Action('cancel')
  async cancel(
    @Ctx()
    ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ) {
    await this.deleteUselessMessages(ctx);
    await ctx.scene.leave();
  }

  async deleteUselessMessages(ctx: Context) {
    await Promise.all(
      ctx.session.messagesToDelete.map(async ({ id }) => {
        await this.bot.telegram.deleteMessage(ctx.chat!.id, id);
      }),
    );
    ctx.session.messagesToDelete = [];
  }
}
