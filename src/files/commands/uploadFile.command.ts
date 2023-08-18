import { Telegraf } from 'telegraf';
import { InjectBot, On } from 'nestjs-telegraf';
import { Command } from '../../command.class';
import { Inject } from '@nestjs/common';
import { Context } from '../../context.interface';
import { FilesService } from '../files.service';

export class UploadFileCommand extends Command {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(FilesService)
    private folderService: FilesService,
  ) {
    super();
  }

  @On('photo')
  async handle(ctx: Context): Promise<void> {
    console.log('huy');
  }
}
