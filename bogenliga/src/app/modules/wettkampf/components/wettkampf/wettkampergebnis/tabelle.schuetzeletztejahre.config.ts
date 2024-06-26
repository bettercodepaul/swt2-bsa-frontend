import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_SCHUETZELETZTEJAHRE_CONFIG: TableConfig = {
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName:   'dsbMitgliedName',
      width: 100,
    },
    {
      translationKey: 'Sportjahr1',
      propertyName: 'wettkampftag1',
      width: 40,
    },
    {
      translationKey: 'Sportjahr2',
      propertyName: 'wettkampftag2',
      width: 40,
    },
    {
      translationKey: 'Sportjahr3',
      propertyName: 'wettkampftag3',
      width: 40,
    },
    {
      translationKey: 'Sportjahr4',
      propertyName: 'wettkampftag4',
      width: 40,
    },
    {
      translationKey: 'Sportjahr5',
      propertyName: 'wettkampftageSchnitt',
      width: 40,
    },
    {
      translationKey: 'Alle Jahre Schnitt',
      propertyName: 'wettkampftageSchnitt',
      width: 40,
    },
  ],
};
