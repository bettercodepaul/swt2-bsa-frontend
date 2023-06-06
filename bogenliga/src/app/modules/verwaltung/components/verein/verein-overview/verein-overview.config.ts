import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const VEREIN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VEREINE.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          25.00,
      },
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.IDENTIFIER',
        propertyName:   'identifier',
        width:          25.00,
      },
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.REGION_NAME',
        propertyName:   'regionName',
        width:          25.00,
      },
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.WEBSITE',
        propertyName:   'website',
        width:          25.00,
      },
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_STAMMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN],
  },

  createPermission : [UserPermission.CAN_CREATE_STAMMDATEN, UserPermission.CAN_CREATE_STAMMDATEN_LIGALEITER]
};
