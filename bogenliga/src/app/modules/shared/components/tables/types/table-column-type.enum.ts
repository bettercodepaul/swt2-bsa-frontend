export enum TableColumnType {
  TEXT, // default
  NUMBER,
  DATE,
  TRANSLATION_KEY, // i18n key
  CUSTOM_MAPPING // use a function to manipulate the cell value
}
