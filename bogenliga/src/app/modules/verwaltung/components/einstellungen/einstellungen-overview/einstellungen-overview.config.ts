import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const EINSTELLUNGEN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.EINSTELLUNGEN.TITLE',

  tableConfig: {

    columns: [

      {
        translationKey:'MANAGMENT.EINSTELLUNGEN.TABLE.HEADERS.Key',
        propertyName: 'vorname',
        width: 20,
      },

      {
        translationKey:'MANAGMENT.EINSTELLUNGEN.TABLE.HEADERS.Value',
        propertyName: 'nachname',
        width: 20,
      },



    ],
    actions: {
      actionTypes: [TableActionType.EDIT],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN]

  },
  // TODO exchange modify for create
  createPermission : [UserPermission.CAN_CREATE_SYSTEMDATEN]









};
