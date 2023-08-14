import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Context } from './context.interface';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { FoldersService } from './folders/folders.service';

export abstract class MyScene {
  protected constructor(
    @InjectBot() protected readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    protected folderService: FoldersService,
  ) {}
  @Action('cancel')
  async cancel(
    @Ctx()
    ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
  ) {
    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: ctx.update.callback_query.from.id,
        folderId: ctx.session.folderId ?? null,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }
}
