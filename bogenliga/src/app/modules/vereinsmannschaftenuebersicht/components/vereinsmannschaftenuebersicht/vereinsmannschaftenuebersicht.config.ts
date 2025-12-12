import {NavigationDialogConfig} from '@shared/components';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';

export const VEREINSMANNSCHAFTENUEBERSICHT_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey: 'VEREINSMANNSCHAFTENUEBERSICHT',
  pageTitleTranslationKey: 'VEREINSMANNSCHAFTENUEBERSICHT.TITLE',
  navigationCardsConfig: {
    navigationCards: []
  },
};

export const MANNSCHAFTEN_TABLE_CONFIG: TableConfig = {

  columns: [
    {
      translationKey: 'VEREINSMANNSCHAFTENUEBERSICHT.TABLE.HEADERS.MANNSCHAFTSNAME',
      propertyName:   'name',
      width:          20,
    },
    {
      translationKey: 'VEREINSMANNSCHAFTENUEBERSICHT.TABLE.HEADERS.LIGANAME',
      propertyName:   'liga',
      width:          20,
    },


  ],
  actions: {
    actionTypes: [TableActionType.VIEW],
    width: 6
  }


};
