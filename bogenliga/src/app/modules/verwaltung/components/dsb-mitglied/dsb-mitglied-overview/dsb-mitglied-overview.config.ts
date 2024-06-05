import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const DSB_MITGLIED_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.DSBMITGLIEDER.TITLE',

  tableConfig: {
    columns: [

      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.VORNAME',
        propertyName:   'vorname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.NACHNAME',
        propertyName:   'nachname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.VEREIN',
        propertyName:   'vereinsName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMITGLIEDER.TABLE.HEADERS.MITGLIEDSNUMMER',
        propertyName:   'mitgliedsnummer',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.VIEW, TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_DSBMITGLIEDER],
    deletePermission : [UserPermission.CAN_DELETE_DSBMITGLIEDER],
    viewPermission : [UserPermission.CAN_READ_DSBMITGLIEDER]
  },
  createPermission : [UserPermission.CAN_CREATE_DSBMITGLIEDER, UserPermission.CAN_CREATE_VEREIN_DSBMITGLIEDER]
};
