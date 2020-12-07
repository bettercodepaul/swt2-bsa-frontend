import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const EINSTELLUNGEN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.EINSTELLUNGEN.TITLE',

  tableConfig: {

    columns: [

      {
        translationKey:'MANAGEMENT.EINSTELLUNGEN_DETAIL.KEY',
        propertyName: 'key',
        width: 20,
      },

      {
        translationKey:'MANAGEMENT.EINSTELLUNGEN_DETAIL.VALUE',
        propertyName: 'value',
        width: 20,
      },



    ],
    actions: {
      actionTypes: [TableActionType.EDIT,TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN]

  },
  // TODO exchange modify for create
  createPermission : [UserPermission.CAN_CREATE_SYSTEMDATEN]









};
