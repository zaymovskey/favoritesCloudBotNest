export interface ICallbackData {
  action: string;
  subjectId: number | null;
}
export function createCallbackData(callbackDataString: string): ICallbackData {
  const callbackDataArray = callbackDataString.split(';');
  return {
    action: callbackDataArray[0],
    subjectId: toNumberOrNull(callbackDataArray[1]),
  };
}

function toNumberOrNull(callbackDataItem: string | 'null'): number | null {
  return Number(callbackDataItem) || null;
}
