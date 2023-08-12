import { Context } from '../context.interface';
import { callbackQuery } from 'telegraf/filters';

export interface callbackData {
  action: string;
  subjectId: number;
}

export function getCallbackQueryData(ctx: Context) {
  let callbackQueryData;
  if (ctx.has(callbackQuery('data'))) {
    callbackQueryData = ctx.callbackQuery;
  }

  return callbackQueryData;
}
