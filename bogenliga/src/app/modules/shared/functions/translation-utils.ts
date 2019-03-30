export function prependLocalizationKey(localizationSet: string, localizationKey: string): string {
  if (localizationSet) {
    return `${localizationSet}.${localizationKey}`;
  } else {
    return localizationKey;
  }
}
