import { Context } from 'telegraf';

export async function sendSeparatorMessage(ctx: Context) {
  await ctx.reply(
    '--------------------------------------------------------------------',
  );
}
