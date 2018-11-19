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
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.VORNAME',
        propertyName:   'vorname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.NACHNAME',
        propertyName:   'nachname',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.GEBURTSDATUM',
        propertyName:   'geburtsdatum',
        type:           TableColumnType.DATE,
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.DSBMANNSCHAFT.TABLE.HEADERS.MANNSCHAFTSNUMMER',
        propertyName:   'mannschaftsnummer',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
