import {NavigationDialogConfig} from '@shared/components';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';

export const MANNSCHAFT_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey: 'MANNSCHAFT',
  pageTitleTranslationKey: 'MANNSCHAFT.TITLE',
  navigationCardsConfig: {
    navigationCards: []
  },
};

export const MANNSCHAFTEN_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'MANNSCHAFT',
      propertyName:   'name',
      width:          20,
    },


  ],
  actions: {
    actionTypes: [TableActionType.VIEW],
    width: 6
  }


};
