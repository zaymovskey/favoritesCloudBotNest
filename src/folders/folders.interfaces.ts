export enum EnumFolderActions {
  NAV = 'nav',
  ADD = 'add',
  REMOVE = 'remove',
}

export const folderActionRegexps: Record<EnumFolderActions, RegExp> = {
  [EnumFolderActions.NAV]: new RegExp(`${EnumFolderActions.NAV}(.+)`),
  [EnumFolderActions.ADD]: new RegExp(`${EnumFolderActions.ADD}(.+)`),
  [EnumFolderActions.REMOVE]: new RegExp(`${EnumFolderActions.REMOVE}(.+)`),
};
