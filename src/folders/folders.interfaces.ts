export enum EnumFolderActions {
  NAV = 'nav_folder',
  ADD = 'add_folder',
  REMOVE = 'remove_folder',
  RENAME = 'rename_folder',
}

export const folderActionRegexps: Record<EnumFolderActions, RegExp> = {
  [EnumFolderActions.NAV]: new RegExp(`${EnumFolderActions.NAV}(.+)`),
  [EnumFolderActions.ADD]: new RegExp(`${EnumFolderActions.ADD}(.+)`),
  [EnumFolderActions.REMOVE]: new RegExp(`${EnumFolderActions.REMOVE}(.+)`),
  [EnumFolderActions.RENAME]: new RegExp(`${EnumFolderActions.RENAME}(.+)`),
};
