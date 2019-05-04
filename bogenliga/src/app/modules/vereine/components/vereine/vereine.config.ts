import {NavigationDialogConfig, OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {tableConfigWithDefaults} from '@shared/components/tables/control/table-config-mapper';
import {TableConfig} from '@shared/components/tables/types/table-config.interface';

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
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.WETTKAMPF',
        propertyName:   'wettkampfOrt',
        width:          20,
      },
      {
        translationKey: 'VEREINE.VEREINE.TABLE.HEADERS.MANNSCHAFT',
        propertyName:   'wettkampfBeginn',
        width:          20,
      }
    ],

};

