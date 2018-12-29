import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableColumnSortOrder} from '../../../../shared/components/tables/types/table-column-sort-order.enum';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const LIGA_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.LIGA.TITLE',

  tableConfig: {
    columns: [
      /**{
        translationKey:   'MANAGEMENT.LIGA.TABLE.HEADERS.ID',
        propertyName:     'id',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },**/
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.LIGANAME',
        propertyName:   'ligaName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.REGIONID',
        propertyName:   'regionId',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.REGIONNAME',
        propertyName:   'regionName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.UEBERGEORDNETID',
        propertyName:   'ligaUebergeordnetId',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.UEBERGEORDNETNAME',
        propertyName:   'ligaUebergeordnetName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.VERANTWORTLICHID',
        propertyName:   'ligaVerantwortlichId',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.VERANTWORTLICHMAIL',
        propertyName:   'ligaVerantwortlichMail',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, /**TableActionType.DELETE**/],
      width:       6
    },
  }
};
