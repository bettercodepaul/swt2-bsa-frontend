import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnSortOrder} from '@shared/components/tables/types/table-column-sort-order.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';

export const VERANSTALTUNG_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VERANSTALTUNG.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.WETTKAMPFTYPID',
        propertyName:   'wettkampftypid',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.SPORTJAHR',
        propertyName:   'sportjahr',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.MELDEDEADLINE',
        propertyName:   'meldedeadline',
        width:          20,
      },
      {
        translationKey:   'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.LIGALEITERMAIL',
        propertyName:     'ligaLeiterMail',
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
