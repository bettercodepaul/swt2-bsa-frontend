import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableColumnSortOrder} from '../../../../shared/components/tables/types/table-column-sort-order.enum';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const DSB_MANNSCHAFT_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.DSBMANNSCHAFT.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.ID',
        propertyName:     'id',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.DSBVEREINNUMMER',
        propertyName:     'vereinId',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.DSBMANNSCHAFTNUMMER',
        propertyName:   'nummer',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
