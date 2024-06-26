import {TableConfig} from '@shared/components/tables/types/table-config.interface';

/**
 * Table layout for a Wettkampf with 6 Mannschaften (Matchstatistik)
 */
export const WETTKAMPF_TABLE_FUENF_MATCHES_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  actions: {actionTypes: []},
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUECKENNUMMER',
      propertyName:   'rueckennummer',
      width:          100,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          100,
      sortable: true
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH1',
      propertyName:   'match1',
      width:          100,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH2',
      propertyName:   'match2',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH3',
      propertyName:   'match3',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH4',
      propertyName:   'match4',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH5',
      propertyName:   'match5',
      width:          30,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTMATCH',
      propertyName:   'pfeilpunkteSchnitt',
      width:          30,
      sortable: true
    }],
};
