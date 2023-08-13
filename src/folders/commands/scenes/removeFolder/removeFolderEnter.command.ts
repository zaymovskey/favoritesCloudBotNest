// import { Command } from '../../../../command.class';
// import { Action, Ctx, InjectBot } from 'nestjs-telegraf';
// import { Telegraf } from 'telegraf';
// import { Context } from '../../../../context.interface';
// import { folderActionRegexps } from '../../../folders.interfaces';
// import { SceneContext } from 'telegraf/typings/scenes';
// import { Update } from 'telegraf/typings/core/types/typegram';
// import { getCallbackQueryData } from '../../../../utils/getCallbackQueryData.util';
// import { createCallbackData } from '../../../../utils/createCallbackData.util';
//
// export class RemoveFolderEnterCommand extends Command {
//   constructor(@InjectBot() private readonly bot: Telegraf<Context>) {
//     super();
//   }
//
//   @Action(folderActionRegexps.remove)
//   async handle(
//     @Ctx() ctx: SceneContext & Context & { update: Update.CallbackQueryUpdate },
//   ): Promise<void> {
//     const callbackQueryData = getCallbackQueryData(ctx);
//     const data = createCallbackData(callbackQueryData!.data);
//
//     ctx.session.folderId = data.subjectId ?? undefined;
//     await ctx.scene.enter('removeFolderScene');
//   }
// }
