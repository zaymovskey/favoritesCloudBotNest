export enum EnumFolderActions {
  NAV = 'nav',
}

export const actionRegexps: Record<EnumFolderActions, RegExp> = {
  [EnumFolderActions.NAV]: new RegExp(`${EnumFolderActions.NAV}(.+)`),
};
