import { Context, Markup } from 'telegraf';
import { Start } from 'nestjs-telegraf';
import { Command } from '../../command.class';
import { UsersService } from '../users.service';
import { Inject } from '@nestjs/common';
import { FoldersService } from '../../folders/folders.service';

export class StartCommand extends Command {
  constructor(
    @Inject(FoldersService) private folderService: FoldersService,
    @Inject(UsersService) private userService: UsersService,
  ) {
    super();
  }

  @Start()
  async handle(ctx: Context): Promise<void> {
    const userFolders = await this.folderService.getUserFoldersKB(
      ctx.message!.from.id,
    );
    const userFoldersKB = this.folderService.createUserFoldersKB(userFolders);

    this.userService.createUser({ userId: ctx.message!.from.id });
    void ctx.reply('Тест1', userFoldersKB);
  }
}
