import {NavigationDialogConfig} from '@shared/components';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';

export const VEREINE_CONFIG: NavigationDialogConfig = {
  moduleTranslationKey: 'VEREINE',
  pageTitleTranslationKey: 'VEREINE.VEREINE.TITLE',
  navigationCardsConfig: {
    navigationCards: []
  },
};

export const VEREINE_TABLE_CONFIG: TableConfig = {

    columns: [
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.VERANSTALTUNG',
        propertyName:   'veranstaltung_name',
        width:          20,
      },
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.WETTKAMPF',
        propertyName:   'wettkampfTag',
        width:          20,
      },
      {
        translationKey: 'TABLE.PLACE',
        propertyName:   'wettkampfOrtsname',
        width:          20,
      },
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.MANNSCHAFT',
        propertyName:   'mannschaftsName',
        width:          20,
      },


    ],
  actions: {
    actionTypes: [TableActionType.MAP],
    width: 6
  }


};

