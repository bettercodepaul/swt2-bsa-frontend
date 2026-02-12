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
      translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.NAME',
      propertyName: 'name',
      width: 100
    },
    {
      translationKey: 'MANAGEMENT.VEREINE.TABLE.HEADERS.REGION_NAME',
      propertyName: 'regionName',
      width: 100
    },
  ],
  actions: {
    actionTypes: [TableActionType.VIEW],
  }
};

