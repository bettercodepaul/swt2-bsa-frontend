import {CommonDialogConfig, OverviewDialogConfig} from '../../../../shared/components/dialogs';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';


export const VEREIN_DETAIL_CONFIG: CommonDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.VEREIN_DETAIL.TITLE',


};
export const VEREIN_DETAIL_TABLE_CONFIG: TableConfig ={

    columns: [
      {
        translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.MANNSCHAFTSNAME',
        propertyName:   'nummer',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.VEREIN_DETAIL.TABLE.HEADERS.DISZIPLIN',
        propertyName:   'disziplin',
        width:          20,
      },
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },

}
