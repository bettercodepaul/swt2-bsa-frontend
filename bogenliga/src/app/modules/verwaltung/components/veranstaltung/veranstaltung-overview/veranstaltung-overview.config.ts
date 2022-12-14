import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnSortOrder} from '@shared/components/tables/types/table-column-sort-order.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const VERANSTALTUNG_OVERVIEW_TABLE_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VERANSTALTUNG.TITLE',
  tableConfig:             {
    columns: [
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          15,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.LIGANAME',
        propertyName:   'ligaName',
        width:          15,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.WETTKAMPFTYPNAME',
        propertyName:   'wettkampftypName',
        width:          15,
      },
      {
        translationKey:   'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.SPORTJAHR',
        propertyName:     'sportjahr',
        width:            15,
        currentSortOrder: TableColumnSortOrder.DESCENDING
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.MELDEDEADLINE',
        propertyName:   'meldeDeadline',
        width:          15,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.PHASE',
        propertyName:   'phase',
        width:          10,
      },
      {
        translationKey: 'MANAGEMENT.VERANSTALTUNG.TABLE.HEADERS.LIGALEITERMAIL',
        propertyName:   'ligaleiterEmail',
        width:          7,
        type:           TableColumnType.NUMBER,

      }
    ],

    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_STAMMDATEN, UserPermission.CAN_MODIFY_MY_VERANSTALTUNG],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN]
  },
  createPermission : [UserPermission.CAN_CREATE_STAMMDATEN, UserPermission.CAN_CREATE_STAMMDATEN_LIGALEITER]
};
