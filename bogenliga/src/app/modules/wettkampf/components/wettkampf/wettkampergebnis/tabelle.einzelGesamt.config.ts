import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_EINZELGESAMT_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MANNSCHAFT',
      propertyName:   'mannschaftName',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'schuetze',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTJAHR',
      propertyName:   'durchschPfeilwert',
      width:          10,
    }
  ],
};
