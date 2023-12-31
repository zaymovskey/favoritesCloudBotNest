import { Telegraf } from 'telegraf';
import { InjectBot, On, Start } from 'nestjs-telegraf';
import { Command } from '../../command.class';
import { UsersService } from '../users.service';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../folders/folders.service';
import { Context } from '../../context.interface';

export class StartCommand extends Command {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(FoldersService)
    private folderService: FoldersService,
    @Inject(UsersService) private userService: UsersService,
  ) {
    super();
  }

  @Start()
  async handle(ctx: Context): Promise<void> {
    ctx.session.folderId = null;
    ctx.session.messagesToDelete = [];

    await this.userService.createUser({ userId: ctx.message!.from.id });

    const [rootFoldersKB, path] =
      await this.folderService.getDirectoryFoldersAndPath({
        userId: ctx.message!.from.id,
        folderId: null,
      });

    await ctx.deleteMessage();

    const mainMessage = await ctx.reply(path, rootFoldersKB);
    ctx.session.mainMessageId = mainMessage.message_id;
  }

  @On('message')
  async allMessage(ctx: Context): Promise<void> {
    await ctx.deleteMessage();
  }
}
