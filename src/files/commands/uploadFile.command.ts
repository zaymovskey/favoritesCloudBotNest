import { Telegraf } from 'telegraf';
import { InjectBot, On } from 'nestjs-telegraf';
import { Command } from '../../command.class';
import { Inject } from '@nestjs/common';
import { Context, PhotoContext } from '../../context.interface';
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
  async handle(ctx: PhotoContext & Context): Promise<void> {
    const photo = ctx.update.message.photo;
    const bestQualityPhoto = photo[photo.length - 1];

    if (ctx.session.folderId === null) {
      void ctx.reply('Невозможно загрузить файл в корневой каталог');
      return;
    }
    console.log(ctx.update.message.photo, 'вызвалась');
  }
}
