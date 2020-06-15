import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const WETTKAMPFKLASE_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.KLASSEN.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSENR',
        propertyName: 'klasseNr',
        width: 20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSENAME',
        propertyName: 'klasseName',
        width: 20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSEALTERMIN',
        propertyName: 'klasseJahrgangMin',
        type: TableColumnType.NUMBER,
        width: 20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSEALTERMAX',
        propertyName: 'klasseJahrgangMax',
        width: 20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT],
      width: 6
    },
    
  },
  //TODO exchange modify for create
  createPermission :[UserPermission.CAN_MODIFY_STAMMDATEN]
};
