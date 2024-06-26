import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_ALLELIGENPROSAISON_CONFIG: TableConfig = {
  // Tabellenspaltenbezeichner in die JSON auslagern
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width:          200,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHNITTWETTKAMPFTAGE1',
      propertyName: 'wettkampftag1',
      width: 40,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHNITTWETTKAMPFTAGE2',
      propertyName: 'wettkampftag2',
      width: 40,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHNITTWETTKAMPFTAGE3',
      propertyName: 'wettkampftag3',
      width: 40,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHNITTWETTKAMPFTAGE4',
      propertyName: 'wettkampftag4',
      width: 40,
    },
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SAISONSCHNITT',
      propertyName: 'wettkampftageSchnitt',
      width: 40,
    },
  ],
};
