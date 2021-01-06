import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const EINSTELLUNGEN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'EINSTELLUNGEN',
  pageTitleTranslationKey: 'MANAGEMENT.EINSTELLUNGEN.TITLE',

  tableConfig: {

    columns: [





      {
        translationKey: 'MANAGEMENT.EINSTELLUNG.TABLE.HEADERS.KEY',
        propertyName: 'key',
        width: 20,
      },

      {
        translationKey: 'MANAGEMENT.EINSTELLUNG.TABLE.HEADERS.VALUE',
        propertyName: 'value',
        width: 20,
      },



    ],
    actions: {
      actionTypes: [TableActionType.EDIT, /*TableActionType.DELETE*/],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_SYSTEMDATEN]
  },

  createPermission : [UserPermission.CAN_CREATE_EINSTELLUNGEN  /*, UserPermission.CAN_CREATE_SYSTEMDATEN, UserPermission.CAN_MODIFY_SYSTEMDATEN */ ]


 // Auskommentierung für eventuell späteren Verwendung von der Delete und Create Funktion











};
