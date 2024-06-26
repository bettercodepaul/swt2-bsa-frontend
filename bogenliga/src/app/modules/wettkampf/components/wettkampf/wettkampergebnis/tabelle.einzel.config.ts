import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_EINZEL_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUEKENNUMMER',
      propertyName:   'rueckenNummer',
      width:          5,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          200,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH',
      propertyName:   'matchNr',
      width:          100,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SATZ1',
      propertyName:   'schuetzeSatz1',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SATZ2',
      propertyName:   'schuetzeSatz2',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SATZ3',
      propertyName:   'schuetzeSatz3',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SATZ4',
      propertyName:   'schuetzeSatz4',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SATZ5',
      propertyName:   'schuetzeSatz5',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTMATCH',
      propertyName:   'pfeilpunkteSchnitt',
      width:          30,
    }
  ],
};
