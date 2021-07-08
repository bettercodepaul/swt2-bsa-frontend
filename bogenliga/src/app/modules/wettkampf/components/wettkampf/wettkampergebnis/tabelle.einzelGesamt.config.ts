import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_EINZELGESAMT_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUEKENNUMMER',
      propertyName:   'rueckenNummer',
      width:          100,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          80,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTJAHR',
      propertyName:   'pfeilpunkteSchnitt',
      width:          80,
    }
  ],
};
