import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '../../../../shared/components/tables/types/table-column-type.enum';

export const SPORTJAHR_LIGA_AUSWAHL_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          20
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.SPORTJAHR',
        propertyName:   'sportjahr',
        width:          20
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.DEADLINE',
        propertyName:   'deadline',
        type:           TableColumnType.DATE,
        width:          20
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.WETTKAMPFTYPNAME',
        propertyName:   'wettkampfTypName',
        width:           20
      },
      {
        translationKey: 'MANAGEMENT.SPORTJAHR_OVERVIEW.TABLE.HEADERS.LIGALEITEREMAIL',
        propertyName:   'ligaleiterEmail',
        width:           20
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
