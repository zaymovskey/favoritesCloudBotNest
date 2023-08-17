import { Ctx, InjectBot, On, Scene } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Telegraf } from 'telegraf';
import { Context } from '../../../../context.interface';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../../folders.service';
import { MyScene } from '../../../../scene.class';

@Scene('renameFolderScene')
export class RenameFolderScene extends MyScene {
  constructor(
    @InjectBot() bot: Telegraf<Context>,
    @Inject(FoldersService) folderService: FoldersService,
  ) {
    super(bot, folderService);
  }

  @On('text')
  async onAnswer2(
    @Ctx() ctx: SceneContext & Context & { message: { text: string } },
  ) {
    const newFolderName = ctx.message.text;
    const folderId = ctx.session.processedFolderId!;
    const userId = ctx.message.from.id;

    const renamedFolder = await this.folderService.renameFolder(
      folderId,
      newFolderName,
    );

    const [folderKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: userId,
        folderId: renamedFolder.parentId,
      });

    await ctx.scene.leave();

    void ctx.reply(path, folderKB);
  }
}
