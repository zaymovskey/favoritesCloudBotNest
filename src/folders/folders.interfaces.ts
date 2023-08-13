export enum EnumFolderActions {
  NAVAHEAD = 'nav',
  NAVBACK = 'navBack',
}

export const actionRegexps: Record<EnumFolderActions, RegExp> = {
  [EnumFolderActions.NAVAHEAD]: new RegExp(`${EnumFolderActions.NAVAHEAD}(.+)`),
  [EnumFolderActions.NAVBACK]: new RegExp(`${EnumFolderActions.NAVBACK}(.+)`),
};
