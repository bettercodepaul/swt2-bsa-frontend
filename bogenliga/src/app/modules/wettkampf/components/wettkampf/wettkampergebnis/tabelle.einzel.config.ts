import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_EINZEL_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH',
      propertyName:   'matchNr',
      width:          5,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MANNSCHAFT',
      propertyName:   'mannschaftName',
      width:          40,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'schuetze',
      width:          45,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTMATCH',
      propertyName:   'durchschPfeilwert',
      width:          10,
    }
  ],
};
