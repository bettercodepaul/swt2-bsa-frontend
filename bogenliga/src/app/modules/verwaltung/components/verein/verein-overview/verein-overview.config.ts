import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const VEREIN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VEREINE.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.IDENTIFIER',
        propertyName:   'identifier',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.REGION_NAME',
        propertyName:   'regionName',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_STAMMDATEN,UserPermission.CAN_CREATE_MANNSCHAFT],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN],




  },

  createPermission : [UserPermission.CAN_CREATE_STAMMDATEN]
};
