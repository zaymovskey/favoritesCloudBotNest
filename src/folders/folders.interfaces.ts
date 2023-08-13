export enum EnumFolderActions {
  NAV = 'nav',
  ADD = 'add',
}

export const folderActionRegexps: Record<EnumFolderActions, RegExp> = {
  [EnumFolderActions.NAV]: new RegExp(`${EnumFolderActions.NAV}(.+)`),
  [EnumFolderActions.ADD]: new RegExp(`${EnumFolderActions.ADD}(.+)`),
};
