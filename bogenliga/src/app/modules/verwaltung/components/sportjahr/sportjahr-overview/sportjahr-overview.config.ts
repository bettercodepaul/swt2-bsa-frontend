import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnSortOrder} from '@shared/components/tables/types/table-column-sort-order.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';

export const SPORTJAHR_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.SPORTJAHR.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.LIGANAME',
        propertyName:   'regionName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.WETTKAMPFTYPNAME',
        propertyName:   'ligaUebergeordnetName',
        width:          20,
      },
      {
        translationKey:   'MANAGEMENT.SPORTJAHR.TABLE.HEADERS.LIGALEITERMAIL',
        propertyName:     'ligaleiterEmail',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
