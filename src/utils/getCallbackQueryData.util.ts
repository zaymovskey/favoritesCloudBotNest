import { Context } from '../context.interface';
import { callbackQuery } from 'telegraf/filters';

export function getCallbackQueryData(ctx: Context) {
  let callbackQueryData;
  if (ctx.has(callbackQuery('data'))) {
    callbackQueryData = ctx.callbackQuery;
  }

  return callbackQueryData;
}
