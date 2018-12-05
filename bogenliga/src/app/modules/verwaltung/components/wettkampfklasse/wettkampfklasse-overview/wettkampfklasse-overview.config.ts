import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableColumnSortOrder} from '../../../../shared/components/tables/types/table-column-sort-order.enum';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const WETTKAMPFKLASE_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.KLASSEN.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey:   'MANAGEMENT.KLASSEN.TABLE.HEADERS.ID',
        propertyName:     'id',
        width:            7,
        type:             TableColumnType.NUMBER,
        currentSortOrder: TableColumnSortOrder.ASCENDING
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSENR',
        propertyName:   'klasseNr',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSENAME',
        propertyName:   'klasseName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSEALTERMIN',
        propertyName:   'klasseJahrgangMin',
        type:           TableColumnType.NUMBER,
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.KLASSEN.TABLE.HEADERS.KLASSEALTERMAX',
        propertyName:   'klasseJahrgangMax',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, /**TableActionType.DELETE**/],
      width:       6
    },
  }
};
