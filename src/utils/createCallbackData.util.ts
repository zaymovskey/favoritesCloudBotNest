export interface ICallbackData {
  action: string;
  subjectId: number;
}
export function createCallbackData(callbackDataString: string) {
  const callbackDataArray = callbackDataString.split(';');
  const callbackData: ICallbackData = {
    action: callbackDataArray[0],
    subjectId: Number(callbackDataArray[1]),
  };

  return callbackData;
}
