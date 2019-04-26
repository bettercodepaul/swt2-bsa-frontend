import {OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '../../../../shared/components/tables/types/table-action-type.enum';

export const REGION_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.REGIONEN.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.NAME',
        propertyName:   'name',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.CONTRACTION',
        propertyName:   'kuerzel',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.REGION_TYP',
        propertyName:   'regionTyp',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.REGIONEN.TABLE.HEADERS.REGION_SUPERORDINATE',
        propertyName:   'regionSuper',
        width:          20,
      }
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
  }
};
