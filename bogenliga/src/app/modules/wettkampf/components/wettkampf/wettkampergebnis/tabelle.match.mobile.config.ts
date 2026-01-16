import {TableConfig} from '@shared/components/tables/types/table-config.interface';

/**
 * Table layout for a Wettkampf with 6 Mannschaften (Matchstatistik)
 */
export const WETTKAMPF_TABLE_MOBILE_MATCHES_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  actions: {actionTypes: []},
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.RUECKENNR',
      propertyName:   'rueckennummer',
      width:          10,
      sortable: true
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          100,
      spanStylesMapper:   () => 'preWrap',
      headerStylesMapper:   () => 'preWrap',
      sortable: true
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.MATCH1',
      propertyName:   'matches',
      spanStylesMapper:   () => 'preWrap',
      width:          100,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.DURCHSCHPFEILWERTMATCH',
      propertyName:   'pfeilpunkteSchnitt',
      headerStylesMapper:   () => 'preWrap',
      width:          30,
      sortable: true
    }],
};
