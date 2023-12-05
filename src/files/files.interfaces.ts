export enum EnumFilesActions {
  UPLOAD = 'upload_files',
  LEAVE_UPLOAD = 'leave_upload_files',
  GET = 'get_files',
  LEAVE_GET = 'leave_get_files',
  REMOVE = 'remove_files',
}

export const fileActionRegexps: { [key in EnumFilesActions]?: RegExp } = {
  [EnumFilesActions.REMOVE]: new RegExp(`${EnumFilesActions.REMOVE}(.+)`),
};
