import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableColumnSortOrder} from '../../../../shared/components/tables/types/table-column-sort-order.enum';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const VEREIN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VEREINE.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey:   'MANAGEMENT.VEREINE.TABLE.HEADERS.ID',
        propertyName:     'id',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
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
        translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.REGION_ID',
        propertyName:   'regionId',
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
  }
};
