import {NavigationDialogConfig} from '@shared/components';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';

export const VEREIN_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey: 'VEREIN',
  pageTitleTranslationKey: 'VEREIN.TITLE',
  navigationCardsConfig: {
    navigationCards: []
  },
};

export const MANNSCHAFTEN_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'VEREIN.TABLE.HEADERS.MANNSCHAFTSNAME',
      propertyName:   'name',
      width:          20,
    },

    {
      translationKey: 'VEREIN.TABLE.HEADERS.VERANSTALTUNGSNAME',
      propertyName:   'veranstaltungName',
      width:          20,
    },

    {
      translationKey: 'VEREIN.TABLE.HEADERS.SPORTJAHR',
      propertyName:   'sportjahr',
      width:          20,
    },


  ],
  actions: {
    actionTypes: [TableActionType.VIEW],
    width: 6
  }


};
