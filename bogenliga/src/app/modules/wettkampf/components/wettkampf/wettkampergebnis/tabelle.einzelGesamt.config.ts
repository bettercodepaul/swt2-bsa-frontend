import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_EINZELGESAMT_CONFIG: TableConfig = {
  actions: {actionTypes: []},
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUECKENNUMMER',
      propertyName:   'rueckenNummer',
      sortable: false
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          80,
      sortable: true
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTJAHR',
      propertyName:   'pfeilpunkteSchnitt',
      width:          80,
      sortable: true
    }
  ],
};
