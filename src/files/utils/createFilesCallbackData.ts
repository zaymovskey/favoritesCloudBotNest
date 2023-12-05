export function createFilesCallbackData(
  action: string,
  fileId: number,
): string {
  return `${action};${fileId}`;
}
