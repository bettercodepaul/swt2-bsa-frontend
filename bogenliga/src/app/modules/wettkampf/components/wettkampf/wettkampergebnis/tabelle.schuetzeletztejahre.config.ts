import {TableConfig} from '@shared/components/tables/types/table-config.interface';

export const WETTKAMPF_TABLE_SCHUETZELETZTEJAHRE_CONFIG: TableConfig = {
  actions: {actionTypes: []},
  columns: [
    {
      translationKey: 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE.COLUMNS.SCHUETZE',
      propertyName: 'schuetzenname',
      width: 100,
      sortable: true
    },
    {
      translationKey: 'Sportjahr1',
      propertyName: 'sportjahr1',
      width: 40,
    },
    {
      translationKey: 'Sportjahr2',
      propertyName: 'sportjahr2',
      width: 40,
    },
    {
      translationKey: 'Sportjahr3',
      propertyName: 'sportjahr3',
      width: 40,
    },
    {
      translationKey: 'Sportjahr4',
      propertyName: 'sportjahr4',
      width: 40,
    },
    {
      translationKey: 'Sportjahr5',
      propertyName: 'sportjahr5',
      width: 40,
    },
    {
      translationKey: 'Alle Jahre Schnitt',
      propertyName: 'allejahre_schnitt',
      width: 40,
      sortable: true
    },
  ],
};
