import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';

export const BENUTZER_OVERVIEW_CONFIG_ACTIVE: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.BENUTZER.TABLE.ACTIVE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.BENUTZER.TABLE.HEADERS.EMAIL',
        propertyName:   'email',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.BENUTZER.TABLE.HEADERS.ROLE',
        propertyName:   'roleName',
        width:          10,
      },
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
