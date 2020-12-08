


import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const EINSTELLUNGEN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'EINSTELLUNGEN',
  pageTitleTranslationKey: 'MANAGEMENT.EINSTELLUNGEN.TITLE',

  tableConfig: {

    columns: [

      
      {
        translationKey:'MANAGEMENT.EINSTELLUNGEN.TABLE',
        propertyName: 'value',

        width: 20,
      },

      {
        translationKey:'MANAGMENT.EINSTELLUNGEN.TABLE.HEADERS.Value',
        propertyName: 'key',
        width: 20,
      },



    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_DSBMITGLIEDER],
    deletePermission : [UserPermission.CAN_DELETE_DSBMITGLIEDER]
  },
  createPermission : [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER]













};
