import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableColumnSortOrder} from '../../../../shared/components/tables/types/table-column-sort-order.enum';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const BENUTZER_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.BENUTZER.TITLE',

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
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
