import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const USER_OVERVIEW_CONFIG_ACTIVE: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.USER.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.USER.TABLE.HEADERS.EMAIL',
        propertyName:   'email',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.USER.TABLE.HEADERS.ROLE',
        propertyName:   'roleName',
        width:          10,
      },
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_SYSTEMDATEN]
  },
  createPermission: [UserPermission.CAN_CREATE_SYSTEMDATEN, UserPermission.CAN_CREATE_SYSTEMDATEN_LIGALEITER]
};
