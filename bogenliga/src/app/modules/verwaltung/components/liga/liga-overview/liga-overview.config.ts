import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnSortOrder} from '@shared/components/tables/types/table-column-sort-order.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const LIGA_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.LIGA.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.LIGANAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.REGIONNAME',
        propertyName:   'regionName',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.LIGA.TABLE.HEADERS.UEBERGEORDNETNAME',
        propertyName:   'ligaUebergeordnetName',
        width:          20,
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
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },

    editPermission : [UserPermission.CAN_MODIFY_STAMMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN]
  },
  createPermission : [UserPermission.CAN_CREATE_STAMMDATEN]
};
